# 切换目录
cd project
# 判断目录是否存在
if [ ! -d "/home/sqm/server/api/project/blog-back" ]; then
    git clone https://gitee.com/sqm147896325/blog-back.git
    cd blog-back
else
    cd blog-back
    git pull
fi
# ! 由于未知原因，使用脚本运行yarn相关命令会宕机，这里仅自动更新，需要手动升级
# # 安装依赖
yarn
# # 打包
yarn build