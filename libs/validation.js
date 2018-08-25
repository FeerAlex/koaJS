module.exports = {
    items: (itemName, itemPrice, fileName, fileSize) => {
        let res;
    
        if (itemName === '') {
            res = {
              mes: 'Не указано название товара'
            }
        }
    
        if (itemPrice === '') {
            res = {
              mes: 'Не указана цена товара'
            }
        }
    
        if (fileName === '' || fileSize === 0) {
            response = {
              mes: 'Не загружена картинка'
            }
        }
        
        return res;
    },

    skills: () => {
        let res;

        return res;
    }
}