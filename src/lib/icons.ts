import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiPostgresql, SiTailwindcss,
  SiDocker, SiFigma, SiPython, SiFirebase, SiJsonwebtokens,
  SiGit, SiHtml5, SiCss3, SiCplusplus, SiFramer, SiVite,
  SiDjango, SiC, SiPostman, SiGithub, SiTableau, SiChartdotjs, SiD3Dotjs,
  SiSwift, SiRust, SiGo, SiKotlin, SiRuby, SiPhp,
  SiScala, SiR, SiDart, SiLua, SiPerl, SiHaskell, SiElixir, SiZig,
  SiSolidity, SiAssemblyscript, SiOpenjdk, SiAmazonwebservices, SiApachecassandra,
  SiVuedotjs, SiAngular, SiSvelte, SiGatsby, SiRemix,
  SiSolid, SiAstro, SiRedux, SiMobx,
  SiWebpack, SiRollupdotjs, SiGulp, SiBabel,
  SiStyledcomponents, SiSass, SiLess, SiBootstrap, SiChakraui,
  SiMui, SiAntdesign, SiShadcnui,
  SiNestjs, SiFastify, SiKoa, SiSpring, SiFlask, SiFastapi, SiLaravel,
  SiDeno, SiBun, SiPnpm, SiYarn, SiNpm,
  SiRedis, SiMysql, SiSqlite, SiMariadb, SiSupabase,
  SiElasticsearch, SiNeo4J, SiPlanetscale, SiCockroachlabs,
  SiNetlify, SiCloudflare, SiDigitalocean, SiHeroku, SiKubernetes, SiVercel, SiGooglecloud,
  SiTerraform, SiAnsible, SiNginx, SiApache, SiGithubactions,
  SiCircleci, SiJenkins, SiGitlab, SiTravisci,
  SiJest, SiVitest, SiCypress, SiMocha, SiChai,
  SiReactrouter, SiReactquery, SiTrpc, SiApollographql, SiGraphql,
  SiPrisma, SiDrizzle, SiSequelize, SiMongoose,
  SiExpo, SiFlutter, SiAndroid, SiApple,
  SiTensorflow, SiPytorch, SiOpenai, SiLangchain, SiHuggingface,
  SiScikitlearn, SiPandas, SiNumpy,
  SiNeovim, SiVim, SiWebstorm, SiIntellijidea,
  SiEslint, SiPrettier,
  SiElectron, SiTauri, SiThreedotjs, SiStorybook, SiFfmpeg,
  SiGnubash, SiMarkdown, SiYaml, SiJson,
  SiSelenium, SiPuppeteer, SiCucumber, SiJira, SiNotion,
  SiCanva, SiAdobephotoshop, SiAdobeillustrator,
  SiLinux, SiUbuntu, SiDebian, SiFedora, SiArchlinux, SiMacos,
  SiIos, SiAndroidstudio, SiXcode,
  SiWebgl, SiWebassembly, SiJpeg, SiSvg, SiWebcomponentsdotorg,
  SiRabbitmq, SiApachekafka, SiGrafana, SiPrometheus,
  SiSentry, SiDatadog, SiNewrelic, SiSplunk,
} from "react-icons/si";

import {
  Book, Award, Code2, Database, Terminal, Cpu, Tablet, Bot, Sparkles,
} from "lucide-react";

import { IconType } from "react-icons";

const siIcons: Record<string, IconType> = {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiPostgresql, SiTailwindcss,
  SiDocker, SiFigma, SiPython, SiFirebase, SiJsonwebtokens,
  SiGit, SiHtml5, SiCss3, SiCplusplus, SiFramer, SiVite,
  SiDjango, SiC, SiPostman, SiGithub, SiTableau, SiChartdotjs, SiD3Dotjs,
  SiSwift, SiRust, SiGo, SiKotlin, SiRuby, SiPhp,
  SiScala, SiR, SiDart, SiLua, SiPerl, SiHaskell, SiElixir, SiZig,
  SiSolidity, SiAssemblyscript, SiOpenjdk, SiAmazonwebservices, SiApachecassandra,
  SiVuedotjs, SiAngular, SiSvelte, SiGatsby, SiRemix,
  SiSolid, SiAstro, SiRedux, SiMobx,
  SiWebpack, SiRollupdotjs, SiGulp, SiBabel,
  SiStyledcomponents, SiSass, SiLess, SiBootstrap, SiChakraui,
  SiMui, SiAntdesign, SiShadcnui,
  SiNestjs, SiFastify, SiKoa, SiSpring, SiFlask, SiFastapi, SiLaravel,
  SiDeno, SiBun, SiPnpm, SiYarn, SiNpm,
  SiRedis, SiMysql, SiSqlite, SiMariadb, SiSupabase,
  SiElasticsearch, SiNeo4J, SiPlanetscale, SiCockroachlabs,
  SiNetlify, SiCloudflare, SiDigitalocean, SiHeroku, SiKubernetes, SiVercel, SiGooglecloud,
  SiTerraform, SiAnsible, SiNginx, SiApache, SiGithubactions,
  SiCircleci, SiJenkins, SiGitlab, SiTravisci,
  SiJest, SiVitest, SiCypress, SiMocha, SiChai,
  SiReactrouter, SiReactquery, SiTrpc, SiApollographql, SiGraphql,
  SiPrisma, SiDrizzle, SiSequelize, SiMongoose,
  SiExpo, SiFlutter, SiAndroid, SiApple,
  SiTensorflow, SiPytorch, SiOpenai, SiLangchain, SiHuggingface,
  SiScikitlearn, SiPandas, SiNumpy,
  SiNeovim, SiVim, SiWebstorm, SiIntellijidea,
  SiEslint, SiPrettier,
  SiElectron, SiTauri, SiThreedotjs, SiStorybook, SiFfmpeg,
  SiGnubash, SiMarkdown, SiYaml, SiJson,
  SiSelenium, SiPuppeteer, SiCucumber, SiJira, SiNotion,
  SiCanva, SiAdobephotoshop, SiAdobeillustrator,
  SiLinux, SiUbuntu, SiDebian, SiFedora, SiArchlinux, SiMacos,
  SiIos, SiAndroidstudio, SiXcode,
  SiWebgl, SiWebassembly, SiJpeg, SiSvg, SiWebcomponentsdotorg,
  SiRabbitmq, SiApachekafka, SiGrafana, SiPrometheus,
  SiSentry, SiDatadog, SiNewrelic, SiSplunk,
};

const lucideIcons: Record<string, IconType> = {
  Book, Award, Code2, Database, Terminal, Cpu, Tablet, Bot, Sparkles,
};

const allIcons: Record<string, IconType> = { ...siIcons, ...lucideIcons };

export function getIcon(name: string): IconType | null {
  return allIcons[name] || null;
}

export const SI_ICON_NAMES = Object.keys(siIcons);
export const LUCIDE_ICON_NAMES = Object.keys(lucideIcons);
export const ALL_ICON_NAMES = Object.keys(allIcons);
export { allIcons };
