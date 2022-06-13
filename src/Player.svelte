<style>
    
    img#body {
        padding-right: 40px;    
    }
    img#hair {
        z-index: 1;
        position: absolute;
        top:-100px;
        left: -50px;
    }
    img#top {
        z-index: 3;
        position: absolute;
        top: 115px;
        left: -50px;
    }
    img#bottom {
        z-index: 2;
        position: absolute;
        top: 364px;
        left: 20px;
    }
    img#feet {
        z-index: 1;
        position: absolute;
        top: 677px;
        left: 26px;
    }
</style>

<script>
    import { hair, top, bottom, feet } from './store.js';
</script>
<img id="body" src="assets/images/you_base.png"/>
<img id="hair" src={`assets/images/Closet/hair/${$hair}.png`}/>
<img id="top" src={`assets/images/Closet/top/${$top}.png`}/>
<img id="bottom" src={`assets/images/Closet/bottom/${$bottom}.png`}/>
<img id="feet" src={`assets/images/Closet/feet/${$feet}.png`}/>