const template = `
<div class="main-container">
    <div class="daily-wrapper">
        <h1 class="daily-title">Today's farm guide</h1>
        <Daily v-for="item in Object.keys(farmableMaterials)" :characters=farmableMaterials[item] :item="item">
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
            Base64.decode(urlParams.get("items").slice(7)),
        );
        return {
            farmableMaterials,
        };
    },
});
