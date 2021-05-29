module.exports = {
  HOST: process.env.DATABASE_URL || "localhost",
  USER: "postgres",
  PASSWORD: "1234567",
  DB: "wpdb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
