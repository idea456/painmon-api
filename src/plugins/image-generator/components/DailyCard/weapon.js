const template = `
    <div class="daily-container">
        <div class="item-container">
            <img class="item-img" :src="'/static/items/' + item + '.png'" :alt="item" />
            <h3 class="item-text">{{parseItem(item)}}</h3>
        </div>
        <div class="weapon-container">
            <img v-for="weapon in weapons" :class="['weapon', weapon.rarity === 5 ? 'five-star' : 'four-star']" :src="'/static/weapons/' + weapon.id + '.png'" :alt="weapon.id"/>
        </div>
    </div>
`;

const { defineComponent } = Vue;

export default defineComponent({
    name: "DailyWeapon",
    template,
    props: {
        weapons: Array,
        item: String,
    },
    methods: {
        parseItem: function (name) {
            let itemName = "";
            for (let i = name.length - 1; i >= 0; i--) {
                if (name[i] !== "_") {
                    itemName += name[i];
                } else {
                    break;
                }
            }
            itemName = itemName.split("").reverse().join("");
            return itemName.charAt(0).toUpperCase() + itemName.slice(1);
        },
    },
});
