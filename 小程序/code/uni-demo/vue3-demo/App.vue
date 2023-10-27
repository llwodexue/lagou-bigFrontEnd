<script>
export default {
	onLaunch: function () {
		console.log("App Launch");
	},
	onShow: function () {
		// console.log("App Show");
	},
	onHide: function () {
		// console.log("App Hide");
	},
	globalData: {
		name: 'bird',
		age: 18
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/static/css/base.scss";

.title {
	color: red;
	border: 2rpx solid $borderColor;
}

page {
	height: 100%;
	border: 2rpx solid orange;
}
</style>
