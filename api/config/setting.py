import os

# 服务端口配置
SERVER_PORT = 5000

# MySQL配置
MYSQL_HOST = "192.168.89.128"
MYSQL_PORT = 3306
MYSQL_USER = "root"
MYSQL_PASSWD = "123456"
MYSQL_DB = "flask_demo"

# Redis配置
# REDIS_HOST = "127.0.0.1"
# REDIS_PORT = 6379
# REDIS_PASSWD = "123456"
# # token过期时间(单位：秒)
# EXPIRE_TIME = 600

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWD = os.getenv("REDIS_PASSWD", "")  # 需与 compose 文件匹配
EXPIRE_TIME = 3600  # 1小时过期时间

# MD5加密盐值
MD5_SALT = "test2020#%*"

# MODEL = "glm-4-flash"
# API_KEY = "0477af7b1589430f95d68cea744698ad.PkjGRr54YAR1CGIy"

MODEL = "deepseek-v3"
API_KEY = "sk-je11Z1WKaO7Shi6jmpCqkjJD2uwT1xqUHgWzL2auyXy5scEs"
