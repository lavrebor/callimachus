<?xml version="1.0" encoding="UTF-8" ?>
<p:pipeline version="1.0" name="render-html" type="calli:render-html"
        xmlns:p="http://www.w3.org/ns/xproc"
        xmlns:c="http://www.w3.org/ns/xproc-step"
        xmlns:l="http://xproc.org/library"
        xmlns:calli="http://callimachusproject.org/rdf/2009/framework#"
        xmlns:sparql="http://www.w3.org/2005/sparql-results#">

    <p:serialization port="result" media-type="text/html" method="html" doctype-system="about:legacy-compat" />

    <p:input port="query" sequence="false" />
    <p:input port="template" sequence="false" />

    <p:option name="output-base-uri" select="''" />

    <p:import href="../library.xpl" />

    <p:variable name="resultId" select="if (string-length($output-base-uri) &gt; 0) then p:resolve-uri($output-base-uri) else p:base-uri()">
        <p:pipe step="render-html" port="query" />
    </p:variable>
    <p:variable name="folder" select="p:resolve-uri('./', $resultId)">
        <p:pipe step="render-html" port="query" />
    </p:variable>

    <p:load name="realm">
        <p:with-option name="href" select="concat('../queries/find-realm.rq?results&amp;target=', encode-for-uri($folder))">
            <p:pipe step="render-html" port="query" />
        </p:with-option>
    </p:load>

    <calli:page-template name="template">
        <p:with-option name="realm" select="//sparql:uri">
            <p:pipe step="realm" port="result" />
        </p:with-option>
        <p:input port="source">
            <p:pipe step="render-html" port="template" />
        </p:input>
    </calli:page-template>

    <calli:render-sparql-query name="query">
        <p:input port="template">
            <p:pipe step="template" port="result" />
        </p:input>
        <p:input port="source">
            <p:pipe step="render-html" port="query" />
        </p:input>
    </calli:render-sparql-query>

    <calli:sparql name="sparql">
        <p:input port="query">
            <p:pipe step="query" port="result" />
        </p:input>
        <p:input port="parameters">
            <p:pipe step="render-html" port="parameters" />
        </p:input>
        <p:input port="source">
            <p:pipe step="render-html" port="source" />
        </p:input>
    </calli:sparql>

    <calli:render>
        <p:with-option name="output-base-uri" select="$resultId" />
        <p:input port="template">
            <p:pipe step="template" port="result" />
        </p:input>
    </calli:render>

    <p:xslt>
        <p:with-option name="output-base-uri" select="$resultId" />
        <p:with-param name="realm" select="//sparql:uri">
            <p:pipe step="realm" port="result" />
        </p:with-param>
        <p:input port="stylesheet">
            <p:document href="../transforms/page-info.xsl" />
        </p:input>
    </p:xslt>

    <p:xslt>
        <p:with-option name="output-base-uri" select="$resultId" />
        <p:input port="stylesheet">
            <p:document href="../transforms/xhtml-to-html.xsl" />
        </p:input>
    </p:xslt>

</p:pipeline>