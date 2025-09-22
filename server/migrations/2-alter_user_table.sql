ALTER TABLE users ADD COLUMN admin BOOLEAN NOT NULL DEFAULT 0;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `admin`) VALUES (2, 'admin', 'admin@gmail.com', '$2b$10$W5/TmCcwWIZ1sbsRAlmnFeVCtbQ.p5Xt4W/cfXrpO/AUNtvvMY936', '2025-07-15 14:50:08', 1);
