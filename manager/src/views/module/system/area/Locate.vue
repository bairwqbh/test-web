<template>
    <el-dialog :title="title" :visible="isShow" @close="$emit('close')"
        v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.1)"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <div class="dialog-map-body">
            <gaode :options="option" @mapcreated="mapcreated"/>
        </div>
    </el-dialog>
</template>

<script>
import Gaode from "@/components/Gaode";

export default {
    data() {
        return {
            map: null,
            districtSearch: new AMap.DistrictSearch({extensions: "all"}),
            loading: false
        };
    },
    props: {
        isShow: Boolean,
        title: String,
        data: Object
    },
    computed: {
        option() {
            return {
                options: {
                    zoom: 12,
                    zooms: [ 3, 20 ],
                    expandZoomRange: true,
                },
                baseLayerMode: "google",
                tools: true,
                controls: [new AMap.Scale()],
                fullScreen: 'map'
            };
        }
    },
    watch: {
        data: function(newData, oldData) {
            const self = this;
            if (self.map) {
                self.locate();
            } else {
                let timer = setInterval(() => {
                    if (self.map) {
                        clearInterval(timer);
                        self.locate();
                    }
                }, 100);
            }
        }
    },
    methods: {
        mapcreated(map) {
            this.map = map;
        },
        locate() {
            const self = this;
            self.loading = true;
            self.map.clearMap();
            self.districtSearch.search(self.data.areaId + "", (status, result) => {
                if (result && result.districtList && result.districtList.length) {
                    let list = result.districtList.map(district => {
                        return new AMap.Polygon({
                            path: district.boundaries,
                            strokeColor: "#FF0000",
                            strokeWeight: 1,
                            strokeStyle: "dashed",
                            fillColor: "#FF0000",
                            fillOpacity: 0.1
                        });
                    });
                    self.map.add(list);
                    self.map.setFitView(list);
                    self.loading = false;
                }
            });
        }
    },
    components: { Gaode }
}
</script>

<style scoped>
.dialog-map-body {
    position: relative;
    height: 60vh;
}
</style>
