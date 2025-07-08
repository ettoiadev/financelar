-- FinanceLar - Complete Database Setup Script for Supabase
-- Execute this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    icon VARCHAR(50) DEFAULT 'circle',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create credit_cards table
CREATE TABLE IF NOT EXISTS credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    bank VARCHAR(100),
    last_four_digits VARCHAR(4),
    credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
    closing_day INTEGER NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recurring_transactions table
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    credit_card_id UUID REFERENCES credit_cards(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_slip', 'automatic_debit', 'pix')),
    recurrence_type VARCHAR(20) NOT NULL CHECK (recurrence_type IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    reminder_days INTEGER DEFAULT 3 CHECK (reminder_days >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_end_date CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create transaction_instances table
CREATE TABLE IF NOT EXISTS transaction_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recurring_transaction_id UUID NOT NULL REFERENCES recurring_transactions(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recurring_transaction_id, due_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON credit_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_cards_active ON credit_cards(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_active ON recurring_transactions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_category ON recurring_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transaction_instances_recurring ON transaction_instances(recurring_transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_instances_due_date ON transaction_instances(due_date);
CREATE INDEX IF NOT EXISTS idx_transaction_instances_status ON transaction_instances(status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON credit_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_instances_updated_at BEFORE UPDATE ON transaction_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for complex queries
CREATE OR REPLACE VIEW v_transactions_with_details AS
SELECT 
    rt.*,
    c.name as category_name,
    c.color as category_color,
    c.icon as category_icon,
    cc.name as credit_card_name,
    cc.bank as credit_card_bank
FROM recurring_transactions rt
JOIN categories c ON rt.category_id = c.id
LEFT JOIN credit_cards cc ON rt.credit_card_id = cc.id
WHERE rt.is_active = true;

CREATE OR REPLACE VIEW v_transaction_instances_with_details AS
SELECT 
    ti.*,
    rt.title,
    rt.description,
    rt.payment_method,
    c.name as category_name,
    c.color as category_color,
    c.icon as category_icon,
    cc.name as credit_card_name,
    cc.bank as credit_card_bank
FROM transaction_instances ti
JOIN recurring_transactions rt ON ti.recurring_transaction_id = rt.id
JOIN categories c ON rt.category_id = c.id
LEFT JOIN credit_cards cc ON rt.credit_card_id = cc.id;

-- Create functions for summary calculations
CREATE OR REPLACE FUNCTION get_monthly_summary(p_user_id UUID, p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
    total_amount DECIMAL,
    paid_amount DECIMAL,
    pending_amount DECIMAL,
    overdue_amount DECIMAL,
    transaction_count BIGINT,
    paid_count BIGINT,
    pending_count BIGINT,
    overdue_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ti.amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'paid' THEN ti.amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'pending' THEN ti.amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'overdue' THEN ti.amount ELSE 0 END), 0) as overdue_amount,
        COUNT(*) as transaction_count,
        COUNT(CASE WHEN ti.status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN ti.status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN ti.status = 'overdue' THEN 1 END) as overdue_count
    FROM transaction_instances ti
    JOIN recurring_transactions rt ON ti.recurring_transaction_id = rt.id
    WHERE rt.user_id = p_user_id
    AND EXTRACT(YEAR FROM ti.due_date) = p_year
    AND EXTRACT(MONTH FROM ti.due_date) = p_month;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_summary(p_user_id UUID, p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
    category_id UUID,
    category_name VARCHAR,
    category_color VARCHAR,
    category_icon VARCHAR,
    total_amount DECIMAL,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as category_id,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COALESCE(SUM(ti.amount), 0) as total_amount,
        COUNT(ti.id) as transaction_count
    FROM categories c
    LEFT JOIN recurring_transactions rt ON c.id = rt.category_id AND rt.is_active = true
    LEFT JOIN transaction_instances ti ON rt.id = ti.recurring_transaction_id
        AND EXTRACT(YEAR FROM ti.due_date) = p_year
        AND EXTRACT(MONTH FROM ti.due_date) = p_month
    WHERE c.user_id = p_user_id AND c.is_active = true
    GROUP BY c.id, c.name, c.color, c.icon
    HAVING COUNT(ti.id) > 0
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert demo user
INSERT INTO users (id, email, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@financlar.com', 'Usuário Demo')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, user_id, name, description, color, icon) VALUES 
('cat-1', '550e8400-e29b-41d4-a716-446655440000', 'Moradia', 'Aluguel, financiamento, condomínio', '#EF4444', 'home'),
('cat-2', '550e8400-e29b-41d4-a716-446655440000', 'Alimentação', 'Supermercado, restaurantes, delivery', '#F59E0B', 'utensils'),
('cat-3', '550e8400-e29b-41d4-a716-446655440000', 'Transporte', 'Combustível, transporte público, manutenção', '#10B981', 'car'),
('cat-4', '550e8400-e29b-41d4-a716-446655440000', 'Saúde', 'Plano de saúde, medicamentos, consultas', '#06B6D4', 'heart'),
('cat-5', '550e8400-e29b-41d4-a716-446655440000', 'Educação', 'Cursos, livros, mensalidades', '#8B5CF6', 'book'),
('cat-6', '550e8400-e29b-41d4-a716-446655440000', 'Lazer', 'Cinema, viagens, hobbies', '#EC4899', 'gamepad-2'),
('cat-7', '550e8400-e29b-41d4-a716-446655440000', 'Serviços Digitais', 'Streaming, software, aplicativos', '#8B5CF6', 'smartphone'),
('cat-8', '550e8400-e29b-41d4-a716-446655440000', 'Seguros', 'Seguro auto, vida, residencial', '#84CC16', 'shield')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample credit cards
INSERT INTO credit_cards (id, user_id, name, bank, last_four_digits, credit_limit, closing_day, due_day) VALUES 
('card-1', '550e8400-e29b-41d4-a716-446655440000', 'Cartão Principal', 'Banco do Brasil', '1234', 5000.00, 15, 10),
('card-2', '550e8400-e29b-41d4-a716-446655440000', 'Cartão Secundário', 'Itaú', '5678', 3000.00, 20, 15)
ON CONFLICT DO NOTHING;

-- Insert sample recurring transactions
INSERT INTO recurring_transactions (id, user_id, category_id, credit_card_id, title, description, amount, payment_method, recurrence_type, due_day, start_date, reminder_days) VALUES 
('trans-1', '550e8400-e29b-41d4-a716-446655440000', 'cat-7', 'card-1', 'Netflix', 'Assinatura mensal', 45.90, 'credit_card', 'monthly', 15, '2024-01-15', 3),
('trans-2', '550e8400-e29b-41d4-a716-446655440000', 'cat-1', NULL, 'Aluguel', 'Aluguel do apartamento', 1200.00, 'bank_slip', 'monthly', 10, '2024-01-10', 5),
('trans-3', '550e8400-e29b-41d4-a716-446655440000', 'cat-7', 'card-1', 'Spotify', 'Assinatura premium', 21.90, 'credit_card', 'monthly', 5, '2024-01-05', 3),
('trans-4', '550e8400-e29b-41d4-a716-446655440000', 'cat-4', NULL, 'Plano de Saúde', 'Unimed', 350.00, 'automatic_debit', 'monthly', 20, '2024-01-20', 5),
('trans-5', '550e8400-e29b-41d4-a716-446655440000', 'cat-3', 'card-2', 'Combustível', 'Abastecimento mensal', 300.00, 'credit_card', 'monthly', 25, '2024-01-25', 3  'Combustível', 'Abastecimento mensal', 300.00, 'credit_card', 'monthly', 25, '2024-01-25', 3)
ON CONFLICT DO NOTHING;

-- Generate sample transaction instances for current month
DO $$
DECLARE
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
    trans_record RECORD;
    due_date DATE;
    instance_status VARCHAR(20);
BEGIN
    FOR trans_record IN 
        SELECT * FROM recurring_transactions 
        WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND is_active = true
    LOOP
        due_date := DATE(current_year || '-' || current_month || '-' || trans_record.due_day);
        
        -- Skip if due date is before start date
        IF due_date >= trans_record.start_date AND (trans_record.end_date IS NULL OR due_date <= trans_record.end_date) THEN
            -- Randomly assign status (70% paid, 30% pending)
            instance_status := CASE WHEN RANDOM() > 0.3 THEN 'paid' ELSE 'pending' END;
            
            INSERT INTO transaction_instances (
                recurring_transaction_id, 
                due_date, 
                amount, 
                status,
                paid_date
            ) VALUES (
                trans_record.id,
                due_date,
                trans_record.amount,
                instance_status,
                CASE WHEN instance_status = 'paid' THEN due_date ELSE NULL END
            ) ON CONFLICT (recurring_transaction_id, due_date) DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_instances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies for demo - adjust based on your auth setup)
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can view own categories" ON categories FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own credit cards" ON credit_cards FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own transactions" ON recurring_transactions FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own transaction instances" ON transaction_instances FOR ALL USING (
    EXISTS (
        SELECT 1 FROM recurring_transactions rt 
        WHERE rt.id = transaction_instances.recurring_transaction_id 
        AND auth.uid()::text = rt.user_id::text
    )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'FinanceLar database setup completed successfully!' as message;
