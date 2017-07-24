# web-app-intro

Webアプリ入門 / introduction to web application.

# アプリを作りたい?

モバイル? デスクトップ? クラウド? Web?

とりあえず、クラウドでWebアプリ!

# Webアプリなら

HTML, CSS, JavaScript を勉強しないと。

* HTML5は必要最低限やる テンプレのコピペで詳細は後回し
* CSS3も後回し
* JavaScript は、やらないと始まらない

# 仕組み / アーキテクチャは?

フロントエンドとサーバサイドがある。

## 開発言語は?

* フロントは JavaScript またはその周りの言語でやらざるを得ない
* サーバもとりあえず JavaScript でいいので Node.js を選択しておく

※サーバサイドだと、JavaとかRubyとかGoとか、なんでもあるが、とりあえず1つ選んでおく。

## インフラ基盤は?

* インフラ基盤はクラウドを使う。GitHub, AmazonとかHerokuで。
* Webサーバは Node.js でいい。余裕があればnginxやIISやApacheでも良い。
* ネットワークとかプロトコルとか後回し
* 通信データ形式JSON で。XMLとか後回し
* ソース管理はGitでやる。でも今はやらないで後回し
* ビルドはWebpack, gulp, browserify 等を使うことになるが、後回し
* フロントエンド・フレームワークも、とりあえず後回し

# JavaScript

* JavaScript を勉強する
* es2015 (es6) generators, arrow functions
* es2017 (es8) async await
