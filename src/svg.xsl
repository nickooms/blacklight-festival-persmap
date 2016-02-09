<stylesheet version="1.0" xmlns="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg">
  <output method="text" indent="no"/>

  <strip-space elements="*"/>

  <template match="/">
  	<text>var Podium = {
</text>
  	<apply-templates select="svg:svg"/>
  	<text>}
</text>
  </template>

  <template match="svg:svg">
  	<text>"layers": [
</text>
  	<apply-templates select="svg:g[@id]"/>
  	<text>
]</text>
  </template>

  <template match="svg:title"></template>
  <template match="svg:desc"></template>

  <template match="svg:g[@id]">
  	<text>{"T":"Group",</text>
  	<apply-templates select="@id"/>
  	<apply-templates select="@display"/>
  	<text>"children":[
</text>
  	<apply-templates select="*"/>
  	<text>
]}</text>
  	<if test="position() != last()">
  		<text>,</text>
  	</if>
  </template>

  <template match="svg:g">
  	<text>{"T":"Group","children":[
</text>
  	<apply-templates select="*"/>
  	<text>
]}</text>
  	<if test="position() != last()">
  		<text>,</text>
  	</if>
  </template>

  <template match="svg:path">
  	<text>{"T":"Path",</text>
  	<apply-templates select="@fill"/>
  	<apply-templates select="@fill-rule"/>
  	<apply-templates select="@stroke"/>
  	<apply-templates select="@stroke-width"/>
  	<apply-templates select="@d"/>
  	<text>
}</text>
  	<if test="position() != last()">
  		<text>,</text>
  	</if>
  </template>

  <template match="svg:g/@id">
  	<text>"name":"</text>
  	<value-of select="."/>
  	<text>",</text>
  </template>

  <template match="svg:g/@display">
  	<text>"display":</text>
  	<choose>
  		<when test=".='visible'">true</when>
  		<otherwise>false</otherwise>
  	</choose>
  	<text>,</text>
  </template>

  <template match="svg:path/@fill">
  	<text>"fill":"</text>
  	<value-of select="."/>
  	<text>",</text>
  </template>

  <template match="svg:path/@fill-rule">
  	<text>"fill-rule":"</text>
  	<value-of select="."/>
  	<text>",</text>
  </template>

  <template match="svg:path/@stroke">
  	<text>"stroke":"</text>
  	<value-of select="."/>
  	<text>",</text>
  </template>

  <template match="svg:path/@stroke-width">
  	<text>"stroke-width":"</text>
  	<value-of select="."/>
  	<text>",</text>
  </template>

  <template match="svg:path/@d">
  	<text>"d":"</text>
  	<value-of select="."/>
  	<text>"</text>
  </template>

  <template match="*">
  	<text>[</text>
  	<apply-templates select="svg:path"/>
  	<text>]</text>
  </template>

</stylesheet>