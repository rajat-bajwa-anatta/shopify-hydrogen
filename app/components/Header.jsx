import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import sanityImage from '~/sanity/ImageBuilder';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu, sanitySettings} = header;

  return (
    <header className="header">
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/" className="header-logo" end>
        {sanitySettings.logo ? (
          <img src={sanityImage(sanitySettings.logo).url()} />
        ) : (
          <strong>{shop.name}</strong>
        )}
      </NavLink>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        function formattedUrl(url) {
          // if the url is internal, we strip the domain
          const fomatterdUrl =
            url.includes('myshopify.com') ||
            url.includes(publicStoreDomain) ||
            url.includes(primaryDomainUrl)
              ? new URL(url).pathname
              : url;
          return fomatterdUrl;
        }

        return (
          <>
            {item.items.length > 0 ? (
              <div className="header-menu-item nested-menu">
                <NavLink
                  className="header-menu-item"
                  end
                  key={item.id}
                  onClick={close}
                  prefetch="intent"
                  to={formattedUrl(item.url)}
                >
                  {item.title}
                </NavLink>
                <ul className="submenu">
                  {item.items.map((subItem) => (
                    <li key={subItem.id}>
                      <NavLink
                        className="header-menu-item"
                        end
                        key={subItem.id}
                        onClick={close}
                        prefetch="intent"
                        to={formattedUrl(subItem.url)}
                      >
                        {subItem.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <NavLink
                className="header-menu-item"
                end
                key={item.id}
                onClick={close}
                prefetch="intent"
                to={formattedUrl(item.url)}
              >
                {item.title}
              </NavLink>
            )}
          </>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink prefetch="intent" to="/account">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <svg width="27" height="22" viewBox="0 0 27 22" fill="none">
        <path
          d="M5.39463 4.17537H26.0006L23.3861 13.3244C23.1891 14.0131 22.7732 14.619 22.2012 15.0502C21.6293 15.4815 20.9324 15.7148 20.2161 15.7147H9.17129C8.35936 15.7152 7.5758 15.416 6.97077 14.8746C6.36574 14.3331 5.98178 13.5874 5.89247 12.7804L4.57039 0.878418H1.27344"
          stroke="white"
        ></path>
        <path
          d="M8.69535 21.4864C9.60578 21.4864 10.3438 20.7484 10.3438 19.8379C10.3438 18.9275 9.60578 18.1895 8.69535 18.1895C7.78492 18.1895 7.04688 18.9275 7.04688 19.8379C7.04688 20.7484 7.78492 21.4864 8.69535 21.4864Z"
          fill="white"
        ></path>
        <path
          d="M21.8809 21.4864C22.7913 21.4864 23.5294 20.7484 23.5294 19.8379C23.5294 18.9275 22.7913 18.1895 21.8809 18.1895C20.9705 18.1895 20.2324 18.9275 20.2324 19.8379C20.2324 20.7484 20.9705 21.4864 21.8809 21.4864Z"
          fill="white"
        ></path>
      </svg>{' '}
      {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
