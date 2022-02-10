import Layout from 'components/Layout'
import { SEO } from 'components/seo'
import { graphql } from 'gatsby'
import React, { useRef, useState } from 'react'
import { push as Menu } from 'react-burger-menu'
import { RedocStandalone } from 'redoc'
import '../styles/api-docs.scss'
import MainSidebar from './Handbook/MainSidebar'
import Navigation from './Handbook/Navigation'
import SectionLinks from './Handbook/SectionLinks'

const SectionLinksTop = ({ previous, next }) => {
    return <SectionLinks className="mt-9" previous={previous} next={next} />
}

export default function ApiEndpoint({ data, pageContext: { slug, menu, previous, next, breadcrumb, breadcrumbBase } }) {
    const {
        data: { id, items, name, url },
        components: { components },
    } = data
    const paths = {}
    JSON.parse(items).map((item) => {
        if (!paths[item.path]) {
            paths[item.path] = {}
        }
        paths[item.path][item.httpVerb] = item.operationSpec
    })
    const mainEl = useRef()

    const [menuOpen, setMenuOpen] = useState(false)

    const handleMobileMenuClick = () => {
        setMenuOpen(!menuOpen)
    }
    const styles = {
        bmOverlay: {
            background: 'transparent',
        },
    }
    return (
        <>
            <SEO title={`${name} - PostHog`} />
            <Layout>
                <div className="handbook-container px-4">
                    <div id="handbook-menu-wrapper">
                        <Menu
                            width="calc(100vw - 80px)"
                            onClose={() => setMenuOpen(false)}
                            customBurgerIcon={false}
                            customCrossIcon={false}
                            styles={styles}
                            pageWrapId="handbook-content-menu-wrapper"
                            outerContainerId="handbook-menu-wrapper"
                            overlayClassName="backdrop-blur"
                            isOpen={menuOpen}
                        >
                            <MainSidebar height={'auto'} menu={menu} slug={slug} className="p-5 pb-32 md:hidden" />
                        </Menu>
                        <Navigation
                            title={name}
                            filePath={null}
                            breadcrumb={breadcrumb}
                            breadcrumbBase={breadcrumbBase}
                            menuOpen={menuOpen}
                            handleMobileMenuClick={handleMobileMenuClick}
                        />
                    </div>
                    <section id="handbook-content-menu-wrapper">
                        <SectionLinksTop next={next} previous={previous} />
                        <div className="flex items-start mt-8">
                            <MainSidebar
                                height={'auto'}
                                sticky
                                top={90}
                                mainEl={mainEl}
                                menu={menu}
                                slug={slug}
                                className="hidden md:block w-full transition-opacity md:opacity-60 hover:opacity-100 mb-14 flex-1"
                            />
                            <article className="article-content api-content-container" ref={mainEl}>
                                <RedocStandalone
                                    options={{
                                        // See https://redoc.ly/docs/api-reference-docs/configuration/theming/ for more options
                                        theme: {
                                            typography: {
                                                fontFamily: 'MatterVF',
                                            },
                                            sidebar: {
                                                width: '0px',
                                            },
                                            rightPanel: {
                                                backgroundColor: '#ffffff00',
                                            },
                                            code: {
                                                fontWeight: '600',
                                                color: 'red',
                                                wrap: true,
                                            },
                                        },
                                    }}
                                    spec={{
                                        openapi: '3.0.3',
                                        info: { title: '', description: '' },
                                        paths,
                                        components: JSON.parse(components),
                                    }}
                                />
                            </article>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}

export const query = graphql`
    query ApiEndpoint($id: String!) {
        data: apiEndpoint(id: { eq: $id }) {
            id
            internal {
                content
                description
                ignoreType
                mediaType
            }
            items
            name
            url
        }
        components: apiComponents {
            components
        }
    }
`
