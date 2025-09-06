const { createApp } = Vue;

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

const app = createApp({
    data() {
        return {
            blog: null
        };
    },
    mounted() {
        const id = getQueryParam('id');
        const list = window.BLOGS || [];
        this.blog = list.find(b => b.id === id) || null;
    },
    methods: {
        formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }
});

app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

app.mount('#app');


