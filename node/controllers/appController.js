
const init = async (req, res) => {
    res.render('init', {
        page:'Init'
    })
};

const category = async (req, res) => {};
const notFound = async (req, res) => {};
const searcher = async (req, res) => {};

export {
    init,
    category,
    notFound,
    searcher
}
