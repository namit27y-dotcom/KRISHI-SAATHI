-- ============================================================
-- KRISHI SAATHI: PRODUCTION MYSQL DATABASE SCHEMA
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) DEFAULT '',
    role ENUM('farmer', 'seller', 'buyer', 'admin') NOT NULL DEFAULT 'farmer',
    preferred_language VARCHAR(10) DEFAULT 'en',
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100) DEFAULT '',
    district VARCHAR(100) DEFAULT '',
    village VARCHAR(100) DEFAULT '',
    postal_code VARCHAR(20) DEFAULT '',
    land_area DECIMAL(10,2) DEFAULT 0.00,
    land_unit VARCHAR(20) DEFAULT 'Acres',
    soil_type VARCHAR(100) DEFAULT 'Loamy',
    crops_grown TEXT,
    company_name VARCHAR(255) DEFAULT '',
    gst_number VARCHAR(50) DEFAULT '',
    buyer_type VARCHAR(50) DEFAULT '',
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    location_accuracy DECIMAL(10,2) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_location (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CROP LISTINGS (Farmer marketplace listings)
CREATE TABLE IF NOT EXISTS crop_listings (
    id VARCHAR(64) PRIMARY KEY,
    farmer_id VARCHAR(64) NOT NULL,
    farmer_name VARCHAR(255) NOT NULL,
    crop_name VARCHAR(255) NOT NULL,
    crop_category VARCHAR(100) DEFAULT 'Grain',
    quantity DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(12,2) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(100) DEFAULT '',
    harvest_date DATE NULL,
    description TEXT,
    image_url LONGTEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_crop_farmer (farmer_id),
    INDEX idx_crop_location (state, district),
    INDEX idx_crop_name (crop_name),
    INDEX idx_crop_verified (is_verified),
    CONSTRAINT fk_crop_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. AGRICULTURAL PRODUCTS (Seller store inventory)
CREATE TABLE IF NOT EXISTS agricultural_products (
    id VARCHAR(64) PRIMARY KEY,
    seller_id VARCHAR(64) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    inventory INT NOT NULL DEFAULT 0,
    image_url LONGTEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_prod_seller (seller_id),
    INDEX idx_prod_category (category),
    INDEX idx_prod_verified (is_verified),
    CONSTRAINT fk_prod_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    buyer_id VARCHAR(64) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    seller_id VARCHAR(64) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    type ENUM('crop', 'product') NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    delivery_charge DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('unpaid', 'paid', 'pending_payment', 'failed') DEFAULT 'unpaid',
    payment_id VARCHAR(64) NULL,
    payment_method VARCHAR(50) NULL,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_buyer (buyer_id),
    INDEX idx_orders_seller (seller_id),
    INDEX idx_orders_status (status),
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    item_type ENUM('crop', 'product') NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    item_title VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    INDEX idx_order_items_order (order_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CART & CART ITEMS
CREATE TABLE IF NOT EXISTS cart (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(64) PRIMARY KEY,
    cart_id VARCHAR(64) NOT NULL,
    item_type ENUM('crop', 'product') NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    quantity DECIMAL(12,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cart_items_cart (cart_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    item_type ENUM('crop', 'product', 'seller') NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reviews_item (item_type, item_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id, is_read),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. CONVERSATIONS & DIRECT TRADE MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    participant1_id VARCHAR(64) NOT NULL,
    participant2_id VARCHAR(64) NOT NULL,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_conv_participants (participant1_id, participant2_id),
    CONSTRAINT fk_conv_p1 FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_p2 FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL,
    sender_id VARCHAR(64) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(64) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_msg_conv (conversation_id),
    INDEX idx_msg_receiver (receiver_id, is_read),
    CONSTRAINT fk_msg_conv FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    gateway VARCHAR(50) DEFAULT 'razorpay',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    upi_id VARCHAR(100) DEFAULT 'user@pay',
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'initiated',
    signature VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_txn (transaction_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    payment_id VARCHAR(64) NOT NULL,
    gateway_response TEXT,
    webhook_status VARCHAR(50) DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tx_payment (payment_id),
    CONSTRAINT fk_tx_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. FARMING CATEGORIES & ACADEMY (Animal & Fish Farming Expansion)
CREATE TABLE IF NOT EXISTS farming_categories (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'crops', 'dairy', 'sheep', 'goat', 'poultry', 'pig', 'beekeeping', 'fisheries', 'integrated'
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    name_mr VARCHAR(100) NOT NULL,
    name_mai VARCHAR(100) NOT NULL,
    name_bho VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    description_mai TEXT,
    description_bho TEXT,
    icon VARCHAR(50) DEFAULT 'Sprout',
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    title_mr VARCHAR(255) NOT NULL,
    title_mai VARCHAR(255) NOT NULL,
    title_bho VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    description_mai TEXT,
    description_bho TEXT,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    thumbnail_url TEXT,
    duration_minutes INT DEFAULT 30,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_courses_category (category_id),
    CONSTRAINT fk_courses_category FOREIGN KEY (category_id) REFERENCES farming_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    title_mr VARCHAR(255) NOT NULL,
    title_mai VARCHAR(255) NOT NULL,
    title_bho VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_modules_course (course_id),
    CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    video_url TEXT,
    video_duration VARCHAR(20) DEFAULT '5:00',
    content_en LONGTEXT,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lessons_module (module_id),
    CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_translations (
    id VARCHAR(64) PRIMARY KEY,
    lesson_id VARCHAR(64) NOT NULL,
    language VARCHAR(10) NOT NULL, -- 'hi', 'mr', 'mai', 'bho'
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    summary TEXT,
    UNIQUE KEY uq_lesson_lang (lesson_id, language),
    CONSTRAINT fk_trans_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_videos (
    id VARCHAR(64) PRIMARY KEY,
    lesson_id VARCHAR(64) NOT NULL,
    youtube_video_id VARCHAR(100) NOT NULL,
    youtube_url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(10) DEFAULT 'en',
    duration_seconds INT DEFAULT 0,
    thumbnail_url VARCHAR(255),
    is_primary BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_video_lesson (lesson_id),
    INDEX idx_video_lang (language),
    INDEX idx_video_yt (youtube_video_id),
    CONSTRAINT fk_video_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    passing_score INT DEFAULT 70,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) NOT NULL,
    question_en TEXT NOT NULL,
    question_hi TEXT NOT NULL,
    options_json TEXT NOT NULL, -- JSON array of options
    correct_option_index INT NOT NULL,
    explanation_en TEXT,
    explanation_hi TEXT,
    display_order INT DEFAULT 0,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    quiz_id VARCHAR(64) NOT NULL,
    score INT NOT NULL,
    passed BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_farming_interests (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_cat (user_id, category_id),
    CONSTRAINT fk_interest_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interest_cat FOREIGN KEY (category_id) REFERENCES farming_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    lesson_id VARCHAR(64) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_seconds INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_lesson (user_id, lesson_id),
    CONSTRAINT fk_prog_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_prog_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BOTANICAL KNOWLEDGE BASE & AI LOGS
CREATE TABLE IF NOT EXISTS plant_species (
    id VARCHAR(64) PRIMARY KEY,
    scientific_name VARCHAR(150) UNIQUE NOT NULL,
    common_name VARCHAR(100) NOT NULL,
    family VARCHAR(100) NOT NULL,
    growth_habit VARCHAR(255),
    native_region VARCHAR(150),
    ideal_ph_min DECIMAL(3,1),
    ideal_ph_max DECIMAL(3,1),
    ideal_soil_texture VARCHAR(100),
    water_requirement VARCHAR(20),
    sunlight_requirement VARCHAR(50),
    is_invasive BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plant_local_names (
    id VARCHAR(64) PRIMARY KEY,
    plant_species_id VARCHAR(64) NOT NULL,
    language VARCHAR(10) NOT NULL,
    local_name VARCHAR(100) NOT NULL,
    INDEX idx_species_lang (plant_species_id, language),
    CONSTRAINT fk_localname_species FOREIGN KEY (plant_species_id) REFERENCES plant_species(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plant_diseases_reference (
    id VARCHAR(64) PRIMARY KEY,
    plant_species_id VARCHAR(64) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    typical_symptoms TEXT,
    common_treatment TEXT,
    organic_treatment TEXT,
    CONSTRAINT fk_disease_species FOREIGN KEY (plant_species_id) REFERENCES plant_species(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plant_identification_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    photo_url LONGTEXT NOT NULL,
    identified_species_id VARCHAR(150),
    confidence_score DECIMAL(5,2),
    soil_photo_url LONGTEXT NULL,
    soil_compatibility_result VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_idlogs_user (user_id),
    CONSTRAINT fk_idlogs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS disease_reports (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    confidence DECIMAL(5,2),
    symptoms TEXT,
    causes TEXT,
    organic_treatment TEXT,
    chemical_treatment TEXT,
    preventive_measures TEXT,
    recovery_time VARCHAR(50),
    image_url LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disease_reports_user (user_id),
    CONSTRAINT fk_diseaserep_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS weather_records (
    id VARCHAR(64) PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    temp DECIMAL(5,2),
    humidity DECIMAL(5,2),
    wind DECIMAL(5,2),
    rainfall_prediction VARCHAR(255),
    advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_weather_loc (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fertilizer_plans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    crop_name VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(50),
    soil_type VARCHAR(50),
    field_size DECIMAL(8,2),
    recommended_fertilizer TEXT,
    quantity TEXT,
    schedule TEXT,
    organic_alternatives TEXT,
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS irrigation_plans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    crop_name VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(50),
    soil_type VARCHAR(50),
    water_requirement VARCHAR(255),
    frequency VARCHAR(100),
    timing VARCHAR(100),
    water_saving_advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_history (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_chathist_user (user_id),
    CONSTRAINT fk_chathist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_history (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    feature_type VARCHAR(50) NOT NULL, -- e.g. 'plant_id', 'disease', 'yield_forecast', 'fertilizer', 'irrigation', 'schemes', 'assistant', 'animal_health'
    prompt_input TEXT NOT NULL,
    response_data LONGTEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aihist_user_feature (user_id, feature_type),
    CONSTRAINT fk_aihist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
