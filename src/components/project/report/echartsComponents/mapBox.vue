<!--  -->
<template>
  <div id="mapBox">
		<div>
			<div class="tit">访谈地图</div>
			<div class="map" id="map">
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      addressList: [],
    }
  },
  created () {
    this.projectId = this.$route.query.id
  },
	mounted () {
		this.get_map()
	},
	methods: {
		// 百度地图
    get_map() {
      var map = new BMap.Map("map");    // 创建Map实例
      map.centerAndZoom(new BMap.Point(121.515843, 31.302699), 12);  // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(new BMap.MapTypeControl({
        mapTypes:[
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
				]})
			)
      map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      // 获取访谈地点坐标
      this.httpPost('monitor/getInterview/locations/' + this.projectId).then(res => {
        if (res.code == 0) {
          this.addressList = res.data
          this.addressList.forEach(item => {
            var locations = JSON.parse(item.locations)
            let that = this
            var point = new BMap.Point(+locations.longitude, +locations.latitude);
            map.centerAndZoom(point, 10);
            var marker = new BMap.Marker(point);        // 创建标注
            marker.setTitle('访谈名称：' + item.name);  // 添加标注名称
            marker.addEventListener("click", function () {
              that.$router.push({path: '/talk/info', query: {id: that.projectId, inId: item.id}})
             });
            map.addOverlay(marker); // 将标注添加到地图中
            // 设置标注动画效果。如果参数为null，则取消动画效果。该方法需要在addOverlay方法后设置
            // marker.setAnimation(Animation);
          })
        }
      })
    },
	}
}
</script>

<style  lang='scss'  scoped>
#mapBox{
		margin: 20px 0 20px 0px;
		.tit{
			margin-bottom: 20px;
			// margin-top: 30px;
		}
		.map{
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			height: 300px;
			width: 100%;
		}
	}
</style>
