<template lang="html">

  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  export default {
    name: 'Editorbar',
    data () {
      return {
        info_: null,
        editor: null,
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default: ''
      }
    },
    watch: {
      isClear (val) {
        // 触发清除文本域内容
        if (val) {
          this.editor.txt.clear()
          this.info_ = null
        }
      },
      value (val) {
        if (val !== this.editor.txt.html()) {
          this.editor.txt.html(this.value)
        }
      },
    },
    mounted () {
      this.seteditor()
      this.editor.txt.html(this.value)
    },
    methods: {
      seteditor () {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        this.editor.customConfig.uploadImgServer = this.baseUrl + this.url// 配置服务器端地址
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 3 张图片
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        // this.editor.customConfig.uploadParams = {formFile:'2'};
        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          // 'image', // 插入图片
          'table', // 表格
          'code', // 插入代码
          'undo', // 撤销
          'redo', // 重复
          'fullscreen' // 全屏
        ]

        this.editor.customConfig.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
            // this.$message({
            //   type: 'error',
            //   message: '一次只能上传一张图片'
            // })
          },
          success: (xhr, editor, result) => {
             // 图片上传成功回调
            //
            // console.log(result)
            // let imgUrl = result.data;
            // insertImg(imgUrl)
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            // console.log(editor)
            // 图片上传错误的回调
          },
          customInsert: (insertImg, result, editor) => {
            // 图片上传成功,插入图片的回调
            if (this.url == '/news/uploadRichImg') {
              result.data.data.forEach(item => {
                var url = this.baseUrl + '/richImg/' + item
                insertImg(url)
              })
            } else {
              var url = result.data
                insertImg(url)
            }
          }
        };

        this.editor.customConfig.onchange = (html) => {
          this.info_ = html // 绑定当前逐渐地值
          this.$emit('change', this.info_) // 将内容同步到父组件中
        };

        // 创建富文本编辑器
        this.editor.create()
      }
    }
  }
</script>

<style lang="css">
  .w-e-menu{
    z-index: 13 !important;
  }
  .w-e-text-container{
    z-index: 1 !important;
  }
</style>
<style lang="scss" scoped>
  .editor {
    width: 100%;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    width:100%;
    border: 1px solid #ccc;
    height: 300px;
  }
</style>
