const template = `
<div class="main-container">
    <div class="daily-title">Today's materials</div>
    <div class="daily-container">
        <div class="character-container">
            <img src="ayaka_face.png" alt="Ayaya!" />
        </div>
    </div>
</div>
`;

const { defineComponent } = Vue;

export default defineComponent({
    name: "CharacterCard",
    template,
    setup() {
        const day = "Tuesday";
        return {
            day,
        };
    },
});
