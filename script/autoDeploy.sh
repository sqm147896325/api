#停止服务（使用js中process.exit(1)来退出主进程，而子进程继续执行sh代码）
#yarn stop
#拉取新的代码
git pull
#睡眠，防止过早杀死进程响应无法返回
sleep 3s
#重启服务
yarn start