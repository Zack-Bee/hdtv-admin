### 描述
本项目用于提供东北大学校内直播的服务, 可用于晚会直播, 课堂授课直播, 培训等. 暂时只提供了接入东北大学校园统一身份认证服务平台的版本, 通用版本在noCAS分支.

### 直播方式
在东北大学校内连上校园网, 使用以下设备

#### 手机
测试了很多软件, 最终推荐腾讯视频云微信小程序(支持ios与安卓)以及易-live
这个app. 腾讯视频云的美颜以及清晰度都要更好, 但是易-live支持在直播里放入图片等自定义的内容, 功能更加丰富.

##### 微信小程序
你可以使用腾讯视频云的微信小程序.
使用微信扫描下方二维码, 进入腾讯视频云微信小程序. 

![腾讯视频云小程序](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/wx.png?raw=true)

点击调试工具

![调试工具](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/wx-tiaoshi.jpg?raw=true)

点击RTMP推流

![推流](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/wx-tuiliu.jpg?raw=true)

点击扫码读取

![扫码](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/wx-saoma.jpg?raw=true)

扫描你的推流二维码即可进行直播.

你可以进入直播播放, 扫描RTMP观看的二维码进行观看.

![播放](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/wx-bofang.jpg?raw=true)

#### 易-live APP
使用方法与微信小程序类似

#### 电脑
推荐使用obs直播, 这也是很多主播使用的软件.

打开obs的设置

![obs设置](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/obs-shezhi.png?raw=true)

选择流

![流](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/obs-liu.png?raw=true)

如果你的推流地址是: rtmp://202.118.1.139:1935/neu/a?key=b

那么url填写: rtmp://202.118.1.139:1935/neu

流名称则为: a?key=b

点击确认后, 点击开始推流即可

![推流](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/obs-tuiliu.png?raw=true)

#### 电脑 + 摄像机
将电脑与摄像机连接, 使用obs推流, 在obs里设置来源, 选择摄像机即可, 其他步骤与电脑推流一致.

![来源](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/obs-laiyuan.png?raw=true)

#### 摄像机 + 编码器
请与我们联系, 我们将会提供编码器设备, 进行相关调试.

### 基本页面
直播推流二维码

![直播推流二维码](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/1.png?raw=true)

直播观看地址

![直播观看地址](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/3.png?raw=true)

直播权限控制

![直播权限控制](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/2.png?raw=true)

hdtv显示区域(暂时只提供晚会直播显示在hdtv)

![hdtv显示区域](https://github.com/Zack-Bee/hdtv-admin/blob/master/document/hdtv.png?raw=true)

### 如何观看
使用易-live, 或者腾讯视频云扫描相应观看地址即可观看.
使用手机扫描hdtv观看地址使用浏览器进行观看.(暂不支持)
