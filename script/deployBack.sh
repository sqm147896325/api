# 切换目录
cd project
# 判断目录是否存在
if [ ! -d "/blog-back" ]; then
    git clone https://gitee.com/sqm147896325/blog-back.git
    cd blog-back
else
    cd blog-back
    git pull
fi
# 安装依赖
yarn
# 不知道为什么好像要安装多次才可以使用
yarn
# 打包
yarn build