export const FN_DIR = "fn";
export const ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL = ENV === "production" ? "info" : "debug";
export const PORT = process.env.PORT || 3000;
