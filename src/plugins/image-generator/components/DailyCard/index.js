const template = `
<div class="main-container">
    <div class="daily-wrapper">
        <div class="skeleton-wrapper" v-if="isSunday">
            <img src="/static/primogem.png" class="daily-title-icon" alt="primogem" />
            <h1 class="daily-title">All materials available on Sunday!</h1>
            <img src="/static/mora.png" class="daily-title-icon" alt="primogem" />
        </div>
        <div v-else>
            <div class="daily-header">
                <img src="/static/primogem.png" class="daily-title-icon" alt="primogem" />
                <h1 class="daily-title">Today's farm guide</h1>
                <img src="/static/primogem.png" class="daily-title-icon" alt="primogem" />
            </div>
            <Daily v-for="item in Object.keys(farmableMaterials)" :characters="farmableMaterials[item]" :item="item" />
            <div class="daily-header">
                <img src="/static/mora.png" class="daily-title-icon" alt="primogem" />
                <h1 class="daily-title">Weapons</h1>
                <img src="/static/mora.png" class="daily-title-icon" alt="primogem" />
            </div>
            <DailyWeapon v-for="item in Object.keys(weapons)" :weapons="weapons[item]" :item="item" />
            <div class="daily-footer">
                <h1 class="daily-footer-text">made with PAINMON-API</h1>
            </div>
        </div>
        
    </div>
    <img class="star star-top-left" :src="'/static/star.png'" alt=""/>
    <img class="star star-top-right" :src="'/static/star.png'" alt=""/>
    <img class="star star-bottom-left" :src="'/static/star.png'" alt=""/>
    <img class="star star-bottom-right" :src="'/static/star.png'" alt=""/>
</div>
`;

{/* <div class="weapon-wrapper">
<div class="weapon-container">
    <img v-for="weapon in weapons" :class="['weapon', weapon.rarity === 5 ? 'five-star' : 'four-star']" :src="'/static/weapons/' + weapon.id + '.png'" :alt="weapon.id"/>
</div>
</div> */}

import Daily from "./daily.js";
import DailyWeapon from "./weapon.js"
const { defineComponent } = Vue;

export default defineComponent({
    name: "DailyCard",
    template,
    components: {
        Daily,
        DailyWeapon
    },
    setup() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const farmableMaterials = JSON.parse(
            Base64.decode(urlParams.get("items").slice(7)),
        );
        const weapons = farmableMaterials["weapons"]
        delete farmableMaterials["weapons"]
        return {
            farmableMaterials,
            weapons,
            isSunday: new Date().getDay() === 0
        };
    },
});
