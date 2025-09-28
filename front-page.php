<?php
get_header();
the_post();

$price_per_night = 100;
$discount_name = "Rabat workation";
$discount_amount = 340;
?>

<main id="main" class="main <?php if (!is_front_page()) { echo 'main--subpage'; } ?>"
>
    <?php the_content(); ?>

    <div class="booking-box">
        <div class="booking-box__intro">
            <h4 class="booking-box__title">💵 Cena zawiera wszystkie opłaty!</h4>
        </div>

        <form class="booking-box__form" method="get" action="/zarezerwuj/" data-price-per-night="<?php echo esc_attr($price_per_night,); ?>"
            data-discount-name="<?php echo esc_attr($discount_name); ?>"
            data-discount-amount="<?php echo esc_attr($discount_amount); ?>"
        >
            <div class="booking-box__dates">
                <div class="booking-box__date" data-focus="checkin">
                    <label class="booking-box__label" for="checkin">Zameldowanie:</label>
                    <input type="date" id="checkin" name="checkin" class="booking-box__input" required />
                </div>
                <div class="booking-box__date" data-focus="checkout">
                    <label class="booking-box__label" for="checkout">Wymeldowanie:</label>
                    <input type="date" id="checkout" name="checkout" class="booking-box__input" required />
                </div>
            </div>

            <div class="booking-box__guests">
                <label class="booking-box__label" for="guests">Goście:</label>
                <select id="guests" name="guests" class="booking-box__select">
                    <option value="1-dorosly">1 dorosły</option>
                    <option value="2-doroslych" selected>2 dorosłych</option>
                    <option value="3-doroslych">3 dorosłych</option>
                    <option value="4-doroslych">4 dorosłych</option>
                    <option value="1-dorosly-1-dziecko">1 dorosły + 1 dziecko</option>
                    <option value="2-doroslych-1-dziecko">2 dorosłych + 1 dziecko</option>
                    <option value="2-doroslych-2-dzieci">2 dorosłych + 2 dzieci</option>
                    <option value="2-doroslych-dziecko-pies">2 dorosłych + dziecko + pies</option>
                    <option value="2-doroslych-2-dzieci-pies">2 dorosłych + 2 dzieci + pies</option>
                </select>
            </div>

            <div class="booking-box__summary">
                <div class="booking-box__line">
                    <span class="booking-box__text" data-nights-text>—</span>
                    <span class="booking-box__price" data-nights-price>—</span>
                </div>
                <div class="booking-box__line" data-discount-row>
                    <span class="booking-box__text" data-discount-name><?php echo esc_html($discount_name); ?></span>
                    <span class="booking-box__price" data-discount-amount>-<?php echo esc_html(number_format($discount_amount, 0, ',', ' '),); ?> zł</span>
                </div>
                <div class="booking-box__total">
                    <span class="booking-box__total-label">RAZEM:</span>
                    <span class="booking-box__total-price" data-total>—</span>
                </div>
                <p class="booking-box__note">To będzie wspaniały wyjazd! Na co czekasz?</p>
            </div>

            <input type="hidden" name="nights" value="" data-nights-input />
            <input type="hidden" name="price_per_night" value="<?php echo esc_attr($price_per_night); ?>" />
            <input type="hidden" name="discount_name" value="<?php echo esc_attr($discount_name); ?>" />
            <input type="hidden" name="discount_amount" value="<?php echo esc_attr($discount_amount); ?>" />
            <input type="hidden" name="total" value="" data-total-input />

            <div class="booking-box__actions">
                <button type="submit" class="button booking-box__button">Rezerwuj</button>
            </div>
        </form>
    </div>
</main>
<?php get_footer(); ?>
