class ColorverseGame {
    constructor(container, row_and_column_amount = 5, cell_size = "100px", cell_border_color = "darkgrey", default_cell_color = "lightgrey", cell_colors = ["red", "blue", "green"]) {
        this._colors = cell_colors;
        this._default_color = default_cell_color;
        this._container = container;
        this._amounts = row_and_column_amount;
        this.selected_color = 0;
        this.points = [];


        container.classList.add("cv-cells")

        const game_engine = this;
        for (let cell_id = 0; cell_id < row_and_column_amount ** 2; cell_id++) {
            let new_cell = document.createElement("div");
            function _onclick(e) {
                game_engine._clickhandler(cell_id, e);
            }
            new_cell.onclick = _onclick;
            new_cell.className = "cv-cell"
            new_cell.style.setProperty("--cell-color", this._default_color);
            new_cell.setAttribute("data-cell-color", -1);
            container.appendChild(new_cell)
        }
        container.style.setProperty("--amount", row_and_column_amount);
        container.style.setProperty("--cell-size", cell_size);
        container.style.setProperty("--cell-border-color", cell_border_color);
        container.style.setProperty("--cell-color", default_cell_color);

        let preview = document.createElement("div");
        preview.className = "cv-preview";
        preview.style.setProperty("background-color", this._colors[this.selected_color])
        container.appendChild(preview);

        let modal_game_over = document.createElement("dialog");
        modal_game_over.className = "cv-modal";
        modal_game_over.innerHTML = "<h1>Game Over</h1><p>You lost.</p>"
        container.appendChild(modal_game_over);

        let modal_won = document.createElement("dialog");
        modal_won.className = "cv-modal";
        modal_won.innerHTML = "<h1>Won</h1><p>You won.</p>"
        container.appendChild(modal_won);

        this._elements = {
            preview,
            modal_game_over,
            modal_won
        }
    }

    updatePoints() {
        for (let color in this._colors) {
            console.log(this._colors[color], this.points[color])
        }
    }

    set_cell_color_manual(cell_id, color) {
        this._container.children[cell_id].style.setProperty("--cell-color", color);
        this._container.children[cell_id].setAttribute("data-cell-color", "-2");
    }
    set_cell(cell_id, color_id) {
        this.set_cell_color_manual(cell_id, this._colors[color_id] || this._default_color);
        this._container.children[cell_id].setAttribute("data-cell-color", color_id);
    }
    get_cell(cell_id) {
        return parseInt(this._container.children[cell_id].getAttribute("data-cell-color"));
    }
    clear_cell(cell_id) {
        this.set_cell(cell_id, -1);
    }

    game_over(cell_id) {
        this._elements.modal_game_over.showModal();
        this._elements.preview.style.setProperty("background-color", this._default_color);
        this._container.children[cell_id].classList.add("cv-lost-cause");
    }
    won() {
        this._elements.modal_won.showModal();
        this._container.classList.add("cv-won");
    }

    _clickhandler(cell_id, e) {
        if (this.get_cell(cell_id) != -1) {
            return;
        }

        this.set_cell(cell_id, this.selected_color);

        if (!this.points[this.selected_color]) this.points[this.selected_color] = 0;

        function check(cell_id) {
            const cell_color = this.get_cell(cell_id)

            if (cell_color == -1) return;

            const right_possible = (cell_id + 1) % this._amounts != 0;
            const left_possible = cell_id % this._amounts != 0;
            const top_possible = cell_id >= this._amounts;
            const bottom_possible = cell_id < (this._amounts - 1) ** 2

            const top_left_possible = top_possible && left_possible;
            const top_right_possible = top_possible && right_possible;
            const bottom_left_possible = bottom_possible && left_possible;
            const bottom_right_possible = bottom_possible && right_possible;

            let options = [];

            if (right_possible) options.push(this.get_cell(cell_id + 1));
            if (left_possible) options.push(this.get_cell(cell_id - 1));
            if (bottom_possible) options.push(this.get_cell(cell_id + this._amounts));
            if (top_possible) options.push(this.get_cell(cell_id - this._amounts));

            if (top_left_possible) options.push(this.get_cell(cell_id - this._amounts - 1));
            if (top_right_possible) options.push(this.get_cell(cell_id - this._amounts + 1));
            if (bottom_left_possible) options.push(this.get_cell(cell_id + this._amounts - 1));
            if (bottom_right_possible) options.push(this.get_cell(cell_id + this._amounts + 1));

            if (options.every(v => (v != cell_color && v != -1))) {
                this.points[cell_color] += 8;
                if (right_possible) this.set_cell(cell_id + 1, cell_color);
                if (left_possible) this.set_cell(cell_id - 1, cell_color);
                if (top_possible) this.set_cell(cell_id - this._amounts, cell_color);
                if (bottom_possible) this.set_cell(cell_id + this._amounts, cell_color);

                if (bottom_left_possible) this.set_cell(cell_id + this._amounts - 1, cell_color);
                if (bottom_right_possible) this.set_cell(cell_id + this._amounts + 1, cell_color);

                if (top_left_possible) this.set_cell(cell_id - this._amounts - 1, cell_color);
                if (top_right_possible) this.set_cell(cell_id - this._amounts + 1, cell_color);
            }

            return {
                options,
                right_possible,
                left_possible,
                bottom_possible,
                top_possible,
                top_left_possible,
                top_right_possible,
                bottom_left_possible,
                bottom_right_possible,
            }
        }

        check = check.bind(this);

        const ch = check(cell_id);

        for (let x of ch.options) {
            console.log(x, this.selected_color)
            if (x == this.selected_color) this.points[this.selected_color] += 1;
        }

        if (ch.right_possible) check(cell_id + 1);

        this.updatePoints();

        this.selected_color = this.selected_color += 1;
        if (this.selected_color >= this._colors.length) this.selected_color = 0;
        this._elements.preview.style.setProperty("background-color", this._colors[this.selected_color])
    }
}