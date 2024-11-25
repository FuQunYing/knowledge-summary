#### git
git 是一个版本控制工具
##查看状态
查看git当前的状态 git status
查看git的提交历史 git log，用来确定要回退的版本
查看git的命令历史 git reflog，用来确定要回到的未来的版本
回退到之前的版本 git reset --hard HEAD^(一个^是回退一个，两个就是回退两个，以此类推)
不想回退到之前的版本，后悔了，又想要回之前提交的 git reset --hard 1234版本号。。。
#### 文件控制
删除远程仓库的文件夹，但是不删除本地的
git rm -r --cached .idea  -f
//--cached不会把本地的.idea删除
git commit -m 'delete .idea dir'
git push -u origin master
##gitignore
生成gitignore
git bash --> touch .gitignore
#### git分支
查看分支：git branch
创建分支：git branch name
切换分支：git checkout name
创建+切换分支：git checkout -b name
合并某分支到当前分支：git merge name
删除分支：git branch -d name

#### 错误总结
警告：warning: LF will be replaced by CRLF in angular-summary/angularCLI.md.
   The file will have its original line endings in your working directory.
   这是因为 / 转义字符的问题
解决：git config --global core.autocrlf false







