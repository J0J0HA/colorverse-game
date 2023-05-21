window.addEventListener("DOMContentLoaded", () => {
    let container = document.getElementById("container");
    window.game_engine = new ColorverseGame(container, 10, "9svmin", "black", "lightgrey", [
        "#ff5858",
        "lightblue"
    ]);
})
