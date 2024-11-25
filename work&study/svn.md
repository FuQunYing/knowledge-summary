# Mac 下svn的常用命令

## 用git的形容方式来理解

### clone文件
    svn checkout url (url就是一个地址啊)
    简写为svn co xxxxx

### 添加新文件
    svn add file
    svn add *.php（添加当前目录下所有的php文件）

### 提交更改(什么鬼，x相当于git push，svn不存在本地仓库，直接推到远程？？)
    svn commit -m "some message" [-N] [--no-unlock]  path(path就是改动的某某文件，真麻烦。。。不加不行么，还有选择保持锁，使用-no-unlock开关是什么鬼！)
    简写 svn ci

### 加锁/解锁，，什么意思？
    svn lock -m "LockMesssage" [--force] PATH
    svn unlock PATH

### 更新（就是git pull）
    svn update -r m path
    svn udpate如果后面没有目录，默认将当前目录以及子目录下的所有文件都更新到最新版本
    svn update -r 200 path就是将版本库中的文件path还原到版本200
    svn update path 更新，与版本库同步，如果在提交的时候提示过期的话，是因为冲突，需要先update，修改文件，然后清除svn resolved，最后再提交commit
    简写 svn up

### 查看文件或者目录状态
    svn status path ，目录下的文件和子目录的状态，正常状态不显示 （?：不在svn的控制中；M：内容被修改；C：发生冲突；A：预定加入到版本库；K：被锁定）
    svn status -v path （显示文件和子目录状态，第一列保持相同，第二列显示工作版本号，第三列和第四列显示最后一次修改的版本号和修改人）
    注意，svn status、svn diff 和svn revert这三条明令在没有网络的情况下也可以执行，原因是svn在本地的.svn中保留了本地版本的原始拷贝