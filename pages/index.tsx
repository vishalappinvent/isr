import { GetStaticProps } from 'next';
import Head from 'next/head';
import LocalTimestamp from '../components/LocalTimestamp';
import RegenerationCountdown from '../components/RegenerationCountdown';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
};

interface HomeProps {
  products: Product[];
  generatedAt: string;
}

const REVALIDATE_TIME = 120; // 2 minutes in seconds

export default function Home({ products, generatedAt }: HomeProps) {
  return (
    <>
      <Head>
        <title>Next.js ISR Example</title>
        <meta name="description" content="Incremental Static Regeneration example with 2-minute caching" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Next.js ISR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Demonstration
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Incremental Static Regeneration with intelligent 2-minute caching strategy
            </p>
          </div>

          {/* Info Card Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-10 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                What is ISR?
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Incremental Static Regeneration (ISR) allows you to update static pages after 
              build time without rebuilding your entire site. Pages are generated at build time 
              and regenerated on-demand at a specified interval, providing the perfect balance 
              between performance and freshness.
            </p>
            
            {/* Status Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Cache Duration
                  </span>
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                    2 minutes
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    (120 seconds)
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Products
                  </span>
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                    {products.length} items
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    from pool of 100
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      Active
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-blue-200/50 dark:border-blue-800/30">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
                  Page Generated At
                </span>
                <LocalTimestamp isoString={generatedAt} />
                <div className="mt-3">
                  <RegenerationCountdown generatedAtISO={generatedAt} revalidateSeconds={REVALIDATE_TIME} />
                </div>
              </div>
              
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-4 leading-relaxed">
                💡 Refresh the page multiple times - the timestamp and products will remain the same for 2 minutes.
                After 2 minutes, the next request will regenerate the page with NEW random products.
              </p>
            </div>

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">2-minute intelligent caching</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">Lightning-fast static serving</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">Background regeneration</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">Zero downtime updates</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 md:col-span-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">Dynamic content refresh on each revalidation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Products
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {products.length} randomly selected items from our catalog
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Random</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800">
                        {product.category}
                      </span>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                How ISR Works
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200/50 dark:border-indigo-800/30">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Initial Build</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Page is generated at build time and served statically for optimal performance
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Caching</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All requests within 2 minutes receive the cached version instantly
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50 dark:border-purple-800/30 md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Background Regeneration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  After 2 minutes, the next request triggers background regeneration seamlessly
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Zero Downtime</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Users always get a fast response, even during regeneration process
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/50 dark:border-orange-800/30">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fresh Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Each regeneration fetches NEW random products from the API automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ISR Implementation using getStaticProps
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // Determine the base URL for API calls
    let baseUrl: string;
    
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://isr-phi.vercel.app';
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    const apiUrl = `${baseUrl}/api/products`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      console.error('Invalid API response:', data);
      return {
        props: {
          products: [],
          generatedAt: new Date().toISOString(),
        },
        revalidate: REVALIDATE_TIME,
      };
    }
    
    return {
      props: {
        products: data.products,
        generatedAt: data.generatedAt || new Date().toISOString(),
      },
      // ISR: Revalidate every 120 seconds (2 minutes)
      revalidate: REVALIDATE_TIME,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        generatedAt: new Date().toISOString(),
      },
      revalidate: REVALIDATE_TIME,
    };
  }
};

