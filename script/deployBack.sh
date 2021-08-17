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
npm install --registry=https://registry.npm.taobao.org
# 打包
yarn build