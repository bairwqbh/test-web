<template>
    <div :id="mapId" class="map-container">
        <div id="popInfo" v-if="popInfo">
            <slot name="infoContent"></slot>
        </div>
        <div id="search-box">
            <slot name="search"></slot>
        </div>
        <div id="top-box">
            <slot name="top-box"></slot>
        </div>
        <div id="rt-box">
            <slot name="rt-box"></slot>
        </div>
        <div id="window-box">
            <slot name="window-box"></slot>
        </div>
        <div id="map-switcher" v-if="baseLayerMode != null">
            <el-radio-group v-if="baseLayerMode == 'google'" v-model="googleType" size="mini">
                <el-radio-button label="m">矢量</el-radio-button>
                <el-radio-button label="y">影像</el-radio-button>
                <el-radio-button label="p">地形</el-radio-button>
            </el-radio-group>
        </div>
        <div id="map-tools" v-if="tools">
            <el-button type="primary" size="mini" @click="toolsShow = !toolsShow">工具</el-button>
            <ul class="tools-list" v-show="toolsShow">
                <li class="tools-list-item" @click="distance">测距</li>
                <li class="tools-list-item" @click="area">测面</li>
                <li class="tools-list-item" @click="clear">清除</li>
                <li class="tools-list-item" @click="fullScreen">全屏</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Common } from "cby.assist";

export default {
    data() {
        return {
            mapId: Common.uuid(),
            baseLayerMode: null,
            googleType: "m",
            tools: false,
            toolsShow: false,
            popInfo: false,
        };
    },
    props: {
        options: Object
    },
    mounted() {
        this.initMap();
    },
    destroyed() {
        if (this.map) {
            this.map.destroy();
        }
    },
    methods: {
        initMap() {
            if (this.options) {
                if (this.options.options) {
                    this.map = new AMap.Map(this.mapId, this.options.options);
                } else {
                    this.map = new AMap.Map(this.mapId);
                }
                if (this.options.baseLayerMode) {
                    this.baseLayerMode = this.options.baseLayerMode;
                    switch (this.options.baseLayerMode) {
                        case "google":
                            this.setGoogleLayer();
                            if (this.options.googleType) {
                                this.googleType = this.options.googleType;
                            }
                            break;
                    }
                }
                if (this.options.controls && this.options.controls.length) {
                    for (let control of this.options.controls) {
                        this.map.addControl(control);
                    }
                }
                if (this.options.tools === true) {
                    this.tools = this.options.tools;
                    this.mouseTool = new AMap.MouseTool(this.map);
                    this.mouseTool.on("draw", event => this.mouseTool.close());
                }
                this.popInfo = this.options.popInfo;
            } else {
                this.map = new AMap.Map(this.mapId);
            }
            this.$emit("mapcreated", this.map);
            this.__removeLogo__();
        },
        setZooms(zooms) {
            setTimeout(() => {
                for (let [name, item] of Object.entries(this.map)) {
                    if (item && typeof item === "object") {
                        for (let [key, value] of Object.entries(item)) {
                            if (key === "zooms") {
                                item[key] = zooms;
                            }
                        }
                    }
                }
            }, 300);
        },
        distance() {
            this.mouseTool.rule();
        },
        area() {
            this.mouseTool.measureArea();
        },
        clear() {
            this.mouseTool.close(true);
        },
        fullScreen() {
            if (this.options && this.options.fullScreen === "map") {
                Common.fullScreen(document.getElementById(this.mapId));
            } else {
                Common.fullScreen();
            }
        },
        setGoogleLayer() {
            this.vectorLayer = this.googleLayer("m");
            this.imageLayer = this.googleLayer("y");
            this.imageLayer.hide();
            this.terrainLayer = this.googleLayer("p");
            this.terrainLayer.hide();
            this.map.setLayers([
                this.vectorLayer,
                this.imageLayer,
                this.terrainLayer
            ]);
        },
        googleLayer(type) {
            return new AMap.TileLayer({
                tileUrl: `http://mt{0,1,2,3}.google.cn/vt/lyrs=${type}@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil`,
                zooms: [3, 20]
            });
        },
        __removeLogo__() {
            setTimeout(() => {
                let amap_logo = document.getElementsByClassName('amap-logo');
                if (amap_logo && amap_logo.length) {
                    for (let i = 0; i < amap_logo.length; i++) {
                        amap_logo[i].parentNode.removeChild(amap_logo[i]);
                    } 
                }
                let amap_copyright = document.getElementsByClassName('amap-copyright');
                if (amap_copyright && amap_copyright.length) {
                    for (let i = 0; i < amap_copyright.length; i++) {
                        amap_copyright[i].parentNode.removeChild(amap_copyright[i]);
                    }
                }
            }, 300);
        }
    },
    watch: {
        googleType(type) {
            if (this.vectorLayer) {
                this.vectorLayer.hide();
            }
            if (this.imageLayer) {
                this.imageLayer.hide();
            }
            if (this.terrainLayer) {
                this.terrainLayer.hide();
            }
            switch (type) {
                case "m":
                    this.vectorLayer.show();
                    break;
                case "y":
                    this.imageLayer.show();
                    break;
                case "p":
                    this.terrainLayer.show();
                    break;
            }
        }
    }
}
</script>

<style scoped>
.map-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    bottom: 0;
}

#search-box {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
}

#top-box {
    position: absolute;
    top: 20px;
    left: 300px;
    z-index: 1;
}

#rt-box {
    position: absolute;
    top: 20px;
    right: 210px;
    z-index: 1;
}

#window-box {
    position: absolute;
    z-index: 999999;
}

#popInfo {
    position: absolute;
    margin: 10px;
    width: calc(27% - 5px);
    height: calc(100% - 20px);
    background: #FFFFFF;
    z-index: 1;
}

#map-switcher {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
}

#map-tools {
    position: absolute;
    top: 80px;
    right: 20px;
    z-index: 1;
}

.tools-list {
    padding: 0;
    margin: 0;
    list-style: none;
    border-radius: 4px;
    overflow: auto;
    cursor: pointer;
}

.tools-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    background: white;
    color: #606266;
    font-size: 12px;
}

.tools-list-item:hover { 
    background: #e8f3fe;
}
</style>
