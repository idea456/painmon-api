const template = `
<div class="main-container">
    <h1 class="daily-title">Today's farm guide</h1>
    <div class="daily-container">
        <h3 class="daily-subtitle">Characters</h3>
        <div class="character-container">
            <img v-for="(character, key) in 8" class="character" src="/static/ayaka_face.png" alt="Ayaya!"/>
        </div>
        <h3 class="daily-subtitle">Materials</h3>
        <div class="materials-container">
            <img v-for="(character, key) in 8" class="character" src="/static/ayaka_face.png" alt="Ayaya!" />
        </div>
    </div>
</div>
`;

const { defineComponent } = Vue;

export default defineComponent({
    name: "DailyCard",
    template,
    setup() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const farmableMaterials = JSON.parse(
            Base64.decode(urlParams.get("items").slice(7)),
        );
        console.log("decoded: ", farmableMaterials);
        const day = "Tuesday";
        return {
            day,
        };
    },
});
