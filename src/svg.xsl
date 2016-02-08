<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
  <xsl:output method="text" indent="no"/>

  <xsl:strip-space elements="*"/>

  <xsl:template match="/">{<xsl:apply-templates select="svg:svg"/>}</xsl:template>

  <xsl:template match="svg:svg">layers: [
<xsl:apply-templates select="svg:g[@id]"/>
]</xsl:template>

  <xsl:template match="svg:title"></xsl:template>
  <xsl:template match="svg:desc"></xsl:template>

  <xsl:template match="svg:g[@id]">new Layer({<xsl:apply-templates select="@id"/>,<xsl:apply-templates select="@display"/>, groups: <xsl:apply-templates select="*"/> })<xsl:if test="position() != last()"><xsl:text>,
</xsl:text></xsl:if></xsl:template>

  <xsl:template match="@id"> name: '<xsl:value-of select="."/>' </xsl:template>
  <xsl:template match="@display"> display: <xsl:choose>
  	<xsl:when test=". = 'visible'">true</xsl:when>
  	<xsl:otherwise>false</xsl:otherwise>
  </xsl:choose></xsl:template>

  <xsl:template match="svg:path">path</xsl:template>

  <xsl:template match="*">[<xsl:apply-templates select="svg:path"/>]</xsl:template>
</xsl:stylesheet>