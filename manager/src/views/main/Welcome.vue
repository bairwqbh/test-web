<template>
    <div class="wrapper">
        <div class="welcome">
            <h1 class="title">欢迎光临{{ $config.sysName }}</h1>
            <img class="welcome-img" src="../../assets/img/welcome.png">
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.welcome {
    text-align: center;
}

.title {
    font-size: 30px;
    color: gray;
}

.welcome-img {
    width: 527px;
    height: 164px;
}
</style>
