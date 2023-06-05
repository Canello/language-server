exports.makePreference = (userId) => {
    // Expiration dates
    const now = new Date().toISOString();
    const expiresAt = new Date(now);
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Preference
    const preference = {
        items: [
            {
                title: "1 mês de acesso à Caitlyn",
                description:
                    "1 mês de acesso para treinar conversação em inglês com a Caitlyn, a inteligência artificial.",
                picture_url:
                    "https://images.unsplash.com/photo-1633113215883-a43e36bc6178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
                category_id: "virtual_goods",
                quantity: 1,
                currency_id: "BRL",
                unit_price: 19.99,
            },
        ],
        back_urls: {
            success: "http://localhost:3000",
        },
        metadata: {
            user_id: userId,
        },
        binary_mode: true,
        payment_methods: {
            excluded_payment_types: ["ticket"],
        },
        expires: true,
        expiration_date_from: now,
        expiration_date_to: expiresAt,
    };

    return preference;
};
