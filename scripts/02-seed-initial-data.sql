-- Inserção de dados iniciais para desenvolvimento

-- Categorias padrão
INSERT INTO categories (name, description, color, icon) VALUES
('Moradia', 'Aluguel, financiamento, condomínio', '#EF4444', 'home'),
('Alimentação', 'Supermercado, restaurantes, delivery', '#F59E0B', 'utensils'),
('Transporte', 'Combustível, transporte público, manutenção', '#10B981', 'car'),
('Saúde', 'Plano de saúde, medicamentos, consultas', '#06B6D4', 'heart'),
('Educação', 'Cursos, livros, mensalidades', '#8B5CF6', 'book'),
('Lazer', 'Cinema, viagens, hobbies', '#EC4899', 'gamepad-2'),
('Serviços Digitais', 'Streaming, software, aplicativos', '#6366F1', 'smartphone'),
('Seguros', 'Seguro auto, vida, residencial', '#84CC16', 'shield'),
('Investimentos', 'Aplicações, previdência', '#F97316', 'trending-up'),
('Outros', 'Despesas diversas', '#6B7280', 'more-horizontal')
ON CONFLICT DO NOTHING;

-- Cartões de crédito de exemplo
INSERT INTO credit_cards (name, bank, credit_limit, closing_day, due_day) VALUES
('Cartão Principal', 'Banco do Brasil', 5000.00, 15, 10),
('Cartão Secundário', 'Itaú', 3000.00, 20, 15),
('Cartão Premium', 'Nubank', 8000.00, 25, 20)
ON CONFLICT DO NOTHING;

-- Transações recorrentes de exemplo
INSERT INTO recurring_transactions (title, description, amount, category_id, payment_method, credit_card_id, recurrence_type, due_day, start_date) VALUES
('Netflix', 'Assinatura mensal do Netflix', 29.90, 7, 'credit_card', 1, 'monthly', 5, '2024-01-01'),
('Spotify', 'Assinatura mensal do Spotify', 19.90, 7, 'credit_card', 1, 'monthly', 12, '2024-01-01'),
('Aluguel', 'Aluguel do apartamento', 1200.00, 1, 'bank_slip', NULL, 'monthly', 10, '2024-01-01'),
('Academia', 'Mensalidade da academia', 89.90, 4, 'credit_card', 2, 'monthly', 15, '2024-01-01'),
('Seguro Auto', 'Seguro do veículo', 180.00, 8, 'automatic_debit', NULL, 'monthly', 20, '2024-01-01')
ON CONFLICT DO NOTHING;
