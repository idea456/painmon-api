const template = `
<div class="main-container">
    <div class="daily-wrapper">
        <div class="daily-header">
            <img src="/static/primogem.png" class="daily-title-icon" alt="primogem" />
            <h1 class="daily-title">Today's farm guide</h1>
            <img src="/static/primogem.png" class="daily-title-icon" alt="primogem" />
        </div>
        <Daily v-for="item in Object.keys(farmableMaterials)" :characters="farmableMaterials[item]" :item="item" />
        <div class="daily-footer">
            <h1 class="daily-footer-text">made with PAINMON-API</h1>
        </div>
    </div>
    <img class="star star-top-left" :src="'/static/star.png'" alt=""/>
    <img class="star star-top-right" :src="'/static/star.png'" alt=""/>
    <img class="star star-bottom-left" :src="'/static/star.png'" alt=""/>
    <img class="star star-bottom-right" :src="'/static/star.png'" alt=""/>
</div>
`;

import Daily from "./daily.js";
const { defineComponent } = Vue;

export default defineComponent({
    name: "DailyCard",
    template,
    components: {
        Daily,
    },
    setup() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const farmableMaterials = JSON.parse(
            Base64.decode(urlParams.get("items")),
        );
        console.log("farmableMaterials: ", farmableMaterials);
        return {
            farmableMaterials,
        };
    },
});
