import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  console.log('Fetched Posts:', posts);
  console.log('Query:', query);
  console.log('Posts Length:', posts?.length);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your software product and articles, <br />
          let it been discovered
        </h1>
        <p className="sub-heading !max-w-3xl">
          &quot;Let it be discovered&quot; invites exploration and growth,
          challenging assumptions and expanding horizons, revealing that the
          journey of knowledge is as enriching as the discoveries themselves..
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post) => (
              <StartupCard key={post?._id} post={post as unknown as StartupTypeCard} />
            ))
          ) : (
            <p className="no-results">No Startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
