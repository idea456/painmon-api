const template = `
    <div class="daily-container">
        <div class="item-container">
            <img class="item-img" :src="'/static/items/' + item + '.png'" :alt="item" />
            <h3 class="item-text">{{parseItem(item)}}</h3>
        </div>
        <div class="character-container">
            <img v-for="character in characters" :class="['character', character.element]" :src="'/static/characters/' + character.name + '.png'" :alt="character.name"/>
            </div>
    </div>
`;

const { defineComponent } = Vue;

export default defineComponent({
    name: "Daily",
    template,
    props: {
        characters: Array,
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
