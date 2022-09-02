import Head from 'next/head'
import { sanityClient, urlFor } from '../lib/sanity';
import Link from "next/link";
const recipesQuery = `*[_type=="recipe"]{
  _id,
  name,
  slug,
  title,
  mainImage
}`;

export default function Home({ recipes }) {
  console.log(recipes)
  return (
    <div className="container">
      <Head>
        <title>Hemil's Kitchen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to Hemil's Kitchen</h1>
      <ul className='recipe-list'>
        {recipes?.length > 0 && recipes.map((recipe) => (
          <li key={recipe._id} className='recipe-card'>
            <Link href={`/recipes/${recipe.slug.current}`}>
              <a>
                <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
                <span>{recipe.title}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


export async function getStaticProps() {

  const recipes = await sanityClient.fetch(recipesQuery);
  return { props: { recipes } };

}