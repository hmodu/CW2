var webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'Class Work 2 - Individual Assignment ',
        products: [],
        cart: [],
        globalCheckAsecOrDesc: 'asec',
        MyCartProducts: [],
        showProduct: true,
        order: {
            firstName: '',
            phone: '',
        },

    },

    methods: {
        addToCart(product) {
            this.cart.push(product.id);

            let tempNo = product.availableInventory - webstore.cartCount(product.id);

           console.log("Product Added to Cart");

            if (tempNo > 0) {

                this.MyCartProducts.push({
                    _id: product._id,
                    id: product.id,
                    subject: product.subject,
                    title: product.title,
                    price: product.price,
                    location: product.location,
                    image: product.image,
                    availableInventory: tempNo,
                    availability: 1,
                    rating: product.rating
                })

                console.log(this.MyCartProducts);

                console.log("inventory still greater than 0");
            }

            console.log(this.MyCartProducts);

            if (tempNo < 1) {
                webstore.ChangeAvailability(product.id, 0)

                this.MyCartProducts.push({
                    _id: product._id,
                    id: product.id,
                    subject: product.subject,
                    title: product.title,
                    price: product.price,
                    location: product.location,
                    image: product.image,
                    availableInventory: tempNo,
                    availability: 0,
                    rating: product.rating
                })

                console.log("inventory Reached 0");
            }


        },

        postOrder: function (product) {
            fetch('https://cst3145---cw2.herokuapp.com/collection/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Name: this.order.firstName, Phone: this.order.phone, ProductsInOrder: this.MyCartProducts.map(({ title }) => title) })
            })
                .then(function (data) {
                    console.log(data);

                });


           

            
            this.MyCartProducts.forEach(function (element) {

                if (element.availableInventory > 0) {

                    console.log("I found it More than 0");
                    fetch(`https://cst3145---cw2.herokuapp.com/collection/lessons/${element._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ availableInventory: element.availableInventory })
                    })
                        .then(function (data) {
                            console.log(data);

                        });


                } else {
                    console.log("I found it less than 0");
                    fetch(`https://cst3145---cw2.herokuapp.com/collection/lessons/${element._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            availableInventory: element.availableInventory,
                            availability: 0

                        })
                    })
                        .then(function (data) {
                            console.log(data);

                        });

                }

            });


            alert('Your order has been placed!');
            this.MyCartProducts.splice(product);
            this.order.name = "";
            this.order.phone = "";
            location.reload();

        },


        ChangeAvailability(id, updateAvailability) {

            let index = this.products.findIndex(product => product.id === id);

            if (this.products[index].id == id) {
                console.log("Yes Got it ");
                this.products[index].availability = updateAvailability;
            };

            console.log(id, updateAvailability);

            console.log(this.products[0]['availability']);
        },

        showCheckout() {
            console.log("The ShowChekout Funcation Clicked");
            this.showProduct = this.showProduct ? false : true;
        },

        canAddToCart(product) {
            return product.availableInventory > this.cartCount(product.id);
        },
        cartCount(id) {
            let count = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    count++;
                }
            }
            return count;
        },
        sortProductsByPrice() {
            function compare(a, b) {
                if (a.price > b.price)
                    return 1;
                if (a.price < b.price)
                    return -1;
                return 0;
            }

            if (this.$root.$data.globalCheckAsecOrDesc == 'asec') {
                return this.products.sort(compare)

            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'desc') {

                return this.products.sort(compare).reverse()

            }

        },
        sortProductsByTitle() {
            function compare(a, b) {
                if (a.title > b.title)
                    return 1;
                if (a.title < b.title)
                    return -1;
                return 0;
            }

            if (this.$root.$data.globalCheckAsecOrDesc == 'asec') {

                return this.products.sort(compare)

            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'desc') {

                return this.products.sort(compare).reverse()

            }

        },
        sortProductsByLocation() {
            function compare(a, b) {
                if (a.location > b.location)
                    return 1;
                if (a.location < b.location)
                    return -1;
                return 0;
            }

            if (this.$root.$data.globalCheckAsecOrDesc == 'asec') {

                return this.products.sort(compare)
            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'desc') {

                return this.products.sort(compare).reverse()

            }

        },
        sortProductsBySubject() {
            function compare(a, b) {
                if (a.subject > b.subject)
                    return 1;
                if (a.subject < b.subject)
                    return -1;
                return 0;
            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'asec') {

                return this.products.sort(compare)

            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'desc') {

                return this.products.sort(compare).reverse()

            }

        },
        sortProductsByAvailablity() {

            function compare(a, b) {
                if (a.availability > b.availability)
                    return 1;
                if (a.availability < b.availability)
                    return -1;
                return 0;
            }

            if (this.$root.$data.globalCheckAsecOrDesc == 'asec') {

                console.log("Im inside asec sortProductsByAvailablity");
                console.log(this.products.sort(compare));
                return this.products.sort(compare)
            }
            if (this.$root.$data.globalCheckAsecOrDesc == 'desc') {
                console.log("Im inside desc sortProductsByAvailablity");
                console.log(this.products.sort(compare).reverse());
                return this.products.sort(compare).reverse()

            }

        },


        deleteFromCart: function (product, MyCartProducts) {
            this.MyCartProducts.splice(this.MyCartProducts.indexOf(product), 1);
            this.cart.pop(product);
        },
       

    },
    computed: {
        cartItemCount() {
            return this.cart.length;
        },

        enableShoppingCart() {
            if (this.cart.length > 0) {
                return true;
            } else {

                return false;

            }
        },

    },

    created: function () {

        fetch('https://cst3145---cw2.herokuapp.com//collection/lessons').then(
            function (response) {
                response.json().then(
                    function (json) {
                        // note that we used 'store.product' instead of 'this.product'
                        webstore.products = json;
                        console.log(webstore.products)
                    });
            })


    }

});