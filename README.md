# discordbots_FileSecurityCheck
discordbotを構築する上でファイル内に記載しない方が良い情報などが紛れ込んでいた際に警告を出すCLIツールです。

## 使い方
node.js環境を用意します。
`node file_check`とshellに入力します。そうすると、"scan now"と表示されます。
問題が無ければ、終了後、"No security issues"と表示され、
検出された場合は、"There is a security problem:"と表示された後にファイルと行が表示されます。

### 検出されるもの
discordtoken
discordwebhook
discordtokenをbase64でエンコードしたもの
discordwebhookをbase64でエンコードしたもの

### 最後に
SQLiteやMySQL等も初期状態では暗号化されてないので普通に解析出来てしまいます。
なので値やkeyを保存する時はwebhookなどの重要な情報の場合は暗号化するようにしましょう。
