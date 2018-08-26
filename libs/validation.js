module.exports = {
    items: (itemName, itemPrice, fileName, fileSize) => {
        let mes;

        if (itemPrice === '') {
            mes = 'Не указана цена товара';
        }
    
        if (itemName === '') {
            mes = 'Не указано название товара';
        }
    
        if (fileName === '' || fileSize === 0) {
            mes = 'Не загружена картинка';
        }
        
        return mes;
    },

    skills: (age, concerts, cities, years) => {
        let mes;

        if (!age || !concerts || !cities || !years) {
            mes = 'Заполните все поля!';
        }

        return mes;
    },

    message: (name, email, message) => {
        let mes;

        if (!name || !email || !message) {
            mes = 'Заполните все поля!';
        }

        return mes;
    }
}