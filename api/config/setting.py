import os

# 服务端口配置
SERVER_PORT = 5000

# MySQL配置
MYSQL_HOST = "192.168.89.128"
MYSQL_PORT = 3306
MYSQL_USER = "root"
MYSQL_PASSWD = "123456"
MYSQL_DB = "flask_demo"

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWD = os.getenv("REDIS_PASSWD", "123456")  # 需与 compose 文件匹配
EXPIRE_TIME = 86400  # 1小时过期时间

# MD5加密盐值
MD5_SALT = "test2020#%*"

# MODEL = "glm-4-flash"
# API_KEY = "0477af7b1589430f95d68cea744698ad.PkjGRr54YAR1CGIy"

# MODEL = "deepseek-v3"
# API_KEY = "sk-je11Z1WKaO7Shi6jmpCqkjJD2uwT1xqUHgWzL2auyXy5scEs"
# BASE_URL = "https://api.lkeap.cloud.tencent.com/v1"

# 息壤平台deepseek R1
BASE_URL = "https://wishub-x1.ctyun.cn/v1"
MODEL = "4bd107bff85941239e27b1509eccfe98"
API_KEY = "c7903c954d5340259c1f65b83ad2ac2d"

RAGFLOW_URL = "http://192.168.111.150:8081/api/v1/chats/e21d4da4f3dd11efbc5a0242ac120006"
RAGFLOW_KEY = "Bearer ragflow-IyN2EyYzY2YTU2MzExZWZhNjBjMDI0Mm"

