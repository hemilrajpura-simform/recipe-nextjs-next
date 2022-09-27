import { sanityClient, urlFor, usePreviewSubscription, PortableText } from "../../lib/sanity";
import { useState } from "react";
const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    title,
    slug,
    mainImage,
    ingredient[]{
      _key,
      unit,
      wholeNumber,
      fraction,
      ingredient->{
        name
      }
    },
    instructions,
    likes
  }`;

export default function OneRecipe({ data, preview }) {
    console.log('data', data)
    const [likes, setLikes] = useState(data?.recipe?.likes);
    let { data: recipe } = usePreviewSubscription(recipeQuery, {
        params: { slug: data.recipe?.slug.current },
        initialData: data,
        enabled: preview,
    });
    const addLike = async () => {
        const res = await fetch("../api/handle-like", {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id })
        }).catch((error) => console.log(error))

        const data = await res.json();
        setLikes(data.likes)
    };
    recipe = recipe.recipe;
    return (
        <article className="recipe">
            <h1>{recipe.name}</h1>
            <button onClick={addLike} className="like-button">
                {likes} {"❤️"}
            </button>
            <main className="content">
                <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
                <div className="breakdown">
                    <ul className="ingredients">
                        {recipe?.ingredient?.map((ingredient) => (
                            <li className="ingredient" key={ingredient._key}>
                                {ingredient?.wholeNumber}
                                {ingredient?.fraction}
                                {" "}
                                {ingredient?.unit}
                                <br />
                                {ingredient?.ingredient?.name}
                            </li>
                        ))}
                    </ul>
                    <PortableText className="instructions"
                        blocks={recipe?.instructions}
                        value={recipe?.instructions}
                    />
                </div>
            </main>

        </article>
    )
}
export async function getStaticPaths() {
    const paths = await sanityClient.fetch(
        `*[_type == "recipe" && defined(slug.current)]{
        "params": {
          "slug": slug.current
        }
      }`
    );
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const recipe = await sanityClient.fetch(recipeQuery, { slug });
    console.log(recipe)
    return { props: { data: { recipe }, preview: true } };
}
