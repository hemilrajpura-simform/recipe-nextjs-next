import {
    createClient,
    createPreviewSubscriptionHook,
} from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url';
// import {  as PortableTextComponent } from '@portabletext/react'
import { PortableText as PortableTextComponent } from '@portabletext/react'

const config = {
    projectId: "meyg1f1s",
    dataset: "production",
    apiVersion: "2021-03-25",
    useCdn: false,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// export const PortableText = createPortableTextComponent({
//     ...config,
//     serializers: {},
// });


export const PortableText = (props) => <PortableTextComponent components={{}} {...props} />