-- =====================================================
-- FINANCLAR - COMPLETE DATABASE SETUP FOR SUPABASE
-- =====================================================
-- Execute this script directly in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS transaction_instances CASCADE;
DROP TABLE IF EXISTS recurring_transactions CASCADE;
DROP TABLE IF EXISTS credit_cards CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'folder',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Credit Cards table
CREATE TABLE credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- Recurring Transactions table
CREATE TABLE recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    credit_card_id UUID REFERENCES credit_cards(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_slip', 'automatic_debit', 'pix')),
    recurrence_type VARCHAR(20) NOT NULL CHECK (recurrence_type IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    reminder_days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction Instances table
CREATE TABLE transaction_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recurring_transaction_id UUID REFERENCES recurring_transactions(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recurring_transaction_id, due_date)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_credit_cards_user_id ON credit_cards(user_id);
CREATE INDEX idx_credit_cards_active ON credit_cards(is_active);
CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_category_id ON recurring_transactions(category_id);
CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(is_active);
CREATE INDEX idx_transaction_instances_recurring_id ON transaction_instances(recurring_transaction_id);
CREATE INDEX idx_transaction_instances_due_date ON transaction_instances(due_date);
CREATE INDEX idx_transaction_instances_status ON transaction_instances(status);

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
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

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert sample user
INSERT INTO users (id, email, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'usuario@financlar.com', 'Usuário Demo');

-- Insert categories
INSERT INTO categories (id, user_id, name, description, color, icon) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Moradia', 'Aluguel, financiamento, condomínio', '#EF4444', 'home'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Alimentação', 'Supermercado, restaurantes, delivery', '#F59E0B', 'utensils'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Transporte', 'Combustível, transporte público, manutenção', '#10B981', 'car'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Saúde', 'Plano de saúde, medicamentos, consultas', '#06B6D4', 'heart'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Educação', 'Cursos, livros, mensalidades', '#8B5CF6', 'book'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Lazer', 'Cinema, viagens, hobbies', '#EC4899', 'gamepad-2'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Serviços Digitais', 'Streaming, software, aplicativos', '#8B5CF6', 'smartphone'),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Seguros', 'Seguro auto, vida, residencial', '#84CC16', 'shield');

-- Insert credit cards
INSERT INTO credit_cards (id, user_id, name, bank, last_four_digits, credit_limit, closing_day, due_day) VALUES 
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Cartão Principal', 'Banco do Brasil', '1234', 5000.00, 15, 10),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Cartão Secundário', 'Itaú', '5678', 3000.00, 20, 15),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Cartão Gold', 'Santander', '9012', 8000.00, 25, 20);

-- Insert recurring transactions
INSERT INTO recurring_transactions (id, user_id, category_id, credit_card_id, title, description, amount, payment_method, recurrence_type, due_day, start_date) VALUES 
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Aluguel', 'Aluguel do apartamento', 1200.00, 'bank_slip', 'monthly', 10, '2024-01-10'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440010', 'Netflix', 'Assinatura mensal', 45.90, 'credit_card', 'monthly', 15, '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440010', 'Spotify', 'Assinatura premium', 21.90, 'credit_card', 'monthly', 5, '2024-01-05'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', NULL, 'Plano de Saúde', 'Unimed', 350.00, 'automatic_debit', 'monthly', 20, '2024-01-20'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'Combustível', 'Abastecimento mensal', 300.00, 'credit_card', 'monthly', 25, '2024-01-25'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'iFood', 'Delivery semanal', 120.00, 'credit_card', 'monthly', 30, '2024-01-30'),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440008', NULL, 'Seguro Auto', 'Seguro do veículo', 180.00, 'automatic_debit', 'monthly', 12, '2024-01-12'),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440012', 'Curso Online', 'Plataforma de cursos', 89.90, 'credit_card', 'monthly', 8, '2024-01-08');

-- Generate transaction instances for current and next months
INSERT INTO transaction_instances (recurring_transaction_id, due_date, amount, status, paid_date)
SELECT 
    rt.id,
    DATE(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' * generate_series(0, 2) + INTERVAL '1 day' * (rt.due_day - 1)) as due_date,
    rt.amount,
    CASE 
        WHEN DATE(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' * generate_series(0, 2) + INTERVAL '1 day' * (rt.due_day - 1)) < CURRENT_DATE 
        THEN (ARRAY['paid', 'overdue'])[floor(random() * 2 + 1)]
        ELSE 'pending'
    END as status,
    CASE 
        WHEN DATE(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' * generate_series(0, 2) + INTERVAL '1 day' * (rt.due_day - 1)) < CURRENT_DATE 
        AND random() > 0.3
        THEN DATE(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' * generate_series(0, 2) + INTERVAL '1 day' * (rt.due_day - 1))
        ELSE NULL
    END as paid_date
FROM recurring_transactions rt
WHERE rt.is_active = true;

-- =====================================================
-- CREATE VIEWS FOR EASIER QUERYING
-- =====================================================

-- View for transactions with category and credit card details
CREATE OR REPLACE VIEW v_transactions_with_details AS
SELECT 
    rt.*,
    c.name as category_name,
    c.color as category_color,
    c.icon as category_icon,
    cc.name as credit_card_name,
    cc.bank as credit_card_bank
FROM recurring_transactions rt
LEFT JOIN categories c ON rt.category_id = c.id
LEFT JOIN credit_cards cc ON rt.credit_card_id = cc.id
WHERE rt.is_active = true;

-- View for transaction instances with details
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
LEFT JOIN categories c ON rt.category_id = c.id
LEFT JOIN credit_cards cc ON rt.credit_card_id = cc.id;

-- =====================================================
-- CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get monthly summary
CREATE OR REPLACE FUNCTION get_monthly_summary(p_user_id UUID, p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
    total_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    pending_amount DECIMAL(12,2),
    overdue_amount DECIMAL(12,2),
    transaction_count INTEGER,
    paid_count INTEGER,
    pending_count INTEGER,
    overdue_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ti.amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'paid' THEN ti.amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'pending' THEN ti.amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN ti.status = 'overdue' THEN ti.amount ELSE 0 END), 0) as overdue_amount,
        COUNT(*)::INTEGER as transaction_count,
        COUNT(CASE WHEN ti.status = 'paid' THEN 1 END)::INTEGER as paid_count,
        COUNT(CASE WHEN ti.status = 'pending' THEN 1 END)::INTEGER as pending_count,
        COUNT(CASE WHEN ti.status = 'overdue' THEN 1 END)::INTEGER as overdue_count
    FROM transaction_instances ti
    JOIN recurring_transactions rt ON ti.recurring_transaction_id = rt.id
    WHERE rt.user_id = p_user_id
    AND EXTRACT(YEAR FROM ti.due_date) = p_year
    AND EXTRACT(MONTH FROM ti.due_date) = p_month;
END;
$$ LANGUAGE plpgsql;

-- Function to get category summary
CREATE OR REPLACE FUNCTION get_category_summary(p_user_id UUID, p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
    category_id UUID,
    category_name VARCHAR(100),
    category_color VARCHAR(7),
    category_icon VARCHAR(50),
    total_amount DECIMAL(12,2),
    transaction_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as category_id,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COALESCE(SUM(ti.amount), 0) as total_amount,
        COUNT(ti.id)::INTEGER as transaction_count
    FROM categories c
    LEFT JOIN recurring_transactions rt ON c.id = rt.category_id AND rt.user_id = p_user_id
    LEFT JOIN transaction_instances ti ON rt.id = ti.recurring_transaction_id 
        AND EXTRACT(YEAR FROM ti.due_date) = p_year
        AND EXTRACT(MONTH FROM ti.due_date) = p_month
    WHERE c.user_id = p_user_id AND c.is_active = true
    GROUP BY c.id, c.name, c.color, c.icon
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_instances ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations for demo user)
CREATE POLICY "Allow all operations for demo user" ON users FOR ALL USING (email = 'usuario@financlar.com');
CREATE POLICY "Allow all operations for demo user categories" ON categories FOR ALL USING (user_id = '550e8400-e29b-41d4-a716-446655440000');
CREATE POLICY "Allow all operations for demo user credit_cards" ON credit_cards FOR ALL USING (user_id = '550e8400-e29b-41d4-a716-446655440000');
CREATE POLICY "Allow all operations for demo user recurring_transactions" ON recurring_transactions FOR ALL USING (user_id = '550e8400-e29b-41d4-a716-446655440000');
CREATE POLICY "Allow all operations for demo user transaction_instances" ON transaction_instances FOR ALL USING (
    recurring_transaction_id IN (
        SELECT id FROM recurring_transactions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
    )
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to verify the setup

-- SELECT 'Users created:' as info, COUNT(*) as count FROM users;
-- SELECT 'Categories created:' as info, COUNT(*) as count FROM categories;
-- SELECT 'Credit cards created:' as info, COUNT(*) as count FROM credit_cards;
-- SELECT 'Recurring transactions created:' as info, COUNT(*) as count FROM recurring_transactions;
-- SELECT 'Transaction instances created:' as info, COUNT(*) as count FROM transaction_instances;

-- Test monthly summary function
-- SELECT * FROM get_monthly_summary('550e8400-e29b-41d4-a716-446655440000', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER);

-- Test category summary function
-- SELECT * FROM get_category_summary('550e8400-e29b-41d4-a716-446655440000', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Your FinanceLar database is now ready!
-- Make sure to update your DATABASE_URL environment variable
-- with your Supabase connection string.
