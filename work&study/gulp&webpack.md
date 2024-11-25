## 1.gulp 打包时报错

> 错误信息：GulpUglifyError: unable to minify JavaScript

- 报错的主要原因是JavaScript语法问题，在es5环境里使用了es6、es7的语法。

### 1.1 解决方法一

> 检查哪一个文件中的哪一行有问题，安装gulp-util模块用于打印日志

```txt
npm install --save-dev gulp-util
```
```javascript
gulp.task('script', function() {
	gulp.src(['public/**/*.js','public/lib/**/*.js'])
	.pipe(uglify())
	.on('error',function(err){
		gutil.log(gutil.colors.red('[Error]'), err.toString())
	})
	.pipe('dist/js')
})
// 打印报错内容
ADMINs-Mac-pro:frontend admin$ gulp script
[11:45:54] Using gulpfile ~/workspace/frontend/gulpfile.js
[11:45:54] Starting 'script'...
[11:45:54] Finished 'script' after 14 ms
[11:45:55] [Error] GulpUglifyError: unable to minify JavaScript
Caused by: SyntaxError: Unexpected token: punc (,)
File: /Users/admin/workspace/frontend/public/js/basic.js
Line: 247

// 通过这个方法排查文件
```

### 1.2 继续方法一

> 安装babel模块，gulp-babel、babel-preset-es2015

```txt
npm install --save-dev gulp-babel babel-preset-es2015
```

```javascript
	gulp.task('script',function() {
		gulp.src(['public/**/*.js','public/lib/**/*.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.on('error',function(err){
			gutil.log(gutil.colors.red('[Error]'),err.toString());
		})
		.pipe('dist/js')
	})
```