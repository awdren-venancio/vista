<?php
    class Conexao{
        public $conn;
		public $conect;
		
		function Conexao(){
			/*			
			$hostname= "localhost";
	        $database= "santanap_academico";
	        $username= "santanap_user";
			$password= "s@ntanapos2018";
			*/
			$hostname= "localhost";
	        $database= "sys";
	        $username= "root";
	        $password= "inter";
			
			$conexao = mysqli_connect($hostname, $username, $password, $database)  or die ("Falha na conexão com o Banco de dados");
			$this->conn = mysqli_select_db($conexao,$database);
			mysqli_set_charset($conexao,'utf8');
			
			$this->conect = $conexao;
			
            if(!$this->conn)
                print('Não foi possível se conectar');
        }
		
		function prevenirAtaque($atributo){
			return $atributo;
        	//return mysqli_real_escape_string($conexao, $atributo);
        }
    }
?>