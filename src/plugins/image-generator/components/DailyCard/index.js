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

// const template = `
// <div class="main-container">
//     <h1 class="daily-title">Today's farm guide</h1>
//     <div class="daily-container">
//         <div v-for="(i, k) in 5" class="character-container">
//             <img class="character" src="/static/elegance.png" alt="Ayaya!" />
//             <img v-for="(character, key) in 2" class="character" src="/static/ayaka_face.png" alt="Ayaya!"/>
//         </div>

//     </div>
// </div>
// `;

const { defineComponent } = Vue;

export default defineComponent({
    name: "DailyCard",
    template,
    setup() {
        const queryString = window.location.search;
        const encodedUri = encodeURI(queryString);
        // const urlParams = new URLSearchParams(queryString);
        // const farmableMaterials = JSON.parse(urlParams.get("items"));
        console.log("decode: ", encodedUri);
        const day = "Tuesday";
        return {
            day,
        };
    },
});
